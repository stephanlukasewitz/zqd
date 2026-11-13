"use client";

import { useEffect, useRef } from "react";

// Eine simulierte Wasseroberfläche über einer Szene (Bild + Schrift).
// Wellengleichung auf einem kleinen Gitter (Ping-Pong auf der GPU), daraus
// Normalen für Lichtbrechung und Glanzlichter. Rendert nur, solange sichtbar.

const V = `#version 300 es
in vec2 p; out vec2 uv;
void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const DROP = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D tex; uniform vec2 center; uniform float radius; uniform float strength; uniform float aspect;
void main(){
  vec4 info = texture(tex, uv);
  vec2 d = (center - uv) * vec2(aspect, 1.0);
  float drop = max(0.0, 1.0 - length(d) / radius);
  drop = 0.5 - cos(drop * 3.14159265) * 0.5;
  info.r += drop * strength;
  o = info;
}`;

const UPDATE = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D tex; uniform vec2 delta;
void main(){
  vec4 info = texture(tex, uv);
  vec2 dx = vec2(delta.x, 0.0), dy = vec2(0.0, delta.y);
  float avg = (texture(tex, uv - dx).r + texture(tex, uv - dy).r +
               texture(tex, uv + dx).r + texture(tex, uv + dy).r) * 0.25;
  info.g += (avg - info.r) * 2.0;
  info.g *= 0.986;
  info.r += info.g;
  info.r *= 0.9995;
  o = info;
}`;

const NORMAL = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D tex; uniform vec2 delta;
void main(){
  vec4 info = texture(tex, uv);
  vec3 dxv = vec3(delta.x, texture(tex, vec2(uv.x + delta.x, uv.y)).r - info.r, 0.0);
  vec3 dyv = vec3(0.0, texture(tex, vec2(uv.x, uv.y + delta.y)).r - info.r, delta.y);
  info.ba = normalize(cross(dyv, dxv)).xz;
  o = info;
}`;

const RENDER = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D water; uniform sampler2D scene; uniform float time;
void main(){
  vec4 info = texture(water, uv);
  vec2 n = info.ba;
  // Lichtbrechung: die Szene wird entlang der Wellennormalen verschoben
  vec3 col = texture(scene, uv + n * 0.055).rgb;
  // Glanzlicht auf den Wellenkämmen
  vec3 N = normalize(vec3(n.x, sqrt(max(0.0, 1.0 - dot(n, n))), n.y));
  vec3 L = normalize(vec3(-0.35, 1.0, 0.55));
  float spec = pow(max(0.0, dot(reflect(-L, N), vec3(0.0, 1.0, 0.0))), 80.0);
  col += spec * 0.55;
  // Ein Hauch Kaustik: dort wo sich die Oberfläche krümmt, wird es heller
  col += max(0.0, -info.r) * 0.0 + abs(info.g) * 0.9;
  o = vec4(col, 1.0);
}`;

function shader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

function program(gl, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, V));
  gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "p");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    u[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

function simTarget(gl, size) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return ok ? { tex, fb } : null;
}

/**
 * drawScene(ctx, w, h) zeichnet die Szene (Bild + Schrift) in einen 2D-Canvas.
 * Wird bei Größenänderung neu aufgerufen.
 */
export default function RippleWater({ drawScene, onReady, onFail, className, interactiveRef }) {
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = el.getContext("webgl2", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (reduce || !gl || !gl.getExtension("EXT_color_buffer_float")) {
      onFail?.();
      return;
    }

    let progs;
    try {
      progs = {
        drop: program(gl, DROP),
        update: program(gl, UPDATE),
        normal: program(gl, NORMAL),
        render: program(gl, RENDER),
      };
    } catch {
      onFail?.();
      return;
    }

    const SIZE = 256;
    let a = simTarget(gl, SIZE);
    let b = simTarget(gl, SIZE);
    if (!a || !b) {
      onFail?.();
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Szene-Textur aus einem 2D-Canvas
    const sceneCanvas = document.createElement("canvas");
    const sceneCtx = sceneCanvas.getContext("2d");
    const sceneTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let aspect = 1;
    let disposed = false;
    let visible = true;
    let raf = 0;
    let sceneReady = false;

    const pass = (prog, target, setup) => {
      gl.useProgram(prog.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, target ? SIZE : el.width, target ? SIZE : el.height);
      setup(prog.u);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const swap = () => {
      const t = a;
      a = b;
      b = t;
    };
    const bindTex = (unit, tex) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    };

    const drop = (x, y, radius, strength) => {
      pass(progs.drop, b, (u) => {
        bindTex(0, a.tex);
        gl.uniform1i(u.tex, 0);
        gl.uniform2f(u.center, x, y);
        gl.uniform1f(u.radius, radius);
        gl.uniform1f(u.strength, strength);
        gl.uniform1f(u.aspect, aspect);
      });
      swap();
    };

    const step = () => {
      for (let i = 0; i < 2; i++) {
        pass(progs.update, b, (u) => {
          bindTex(0, a.tex);
          gl.uniform1i(u.tex, 0);
          gl.uniform2f(u.delta, 1 / SIZE, 1 / SIZE);
        });
        swap();
      }
      pass(progs.normal, b, (u) => {
        bindTex(0, a.tex);
        gl.uniform1i(u.tex, 0);
        gl.uniform2f(u.delta, 1 / SIZE, 1 / SIZE);
      });
      swap();
    };

    const resize = async () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      el.width = w;
      el.height = h;
      aspect = w / h;
      sceneCanvas.width = Math.min(w, 2400);
      sceneCanvas.height = Math.round(sceneCanvas.width / aspect);
      await drawScene(sceneCtx, sceneCanvas.width, sceneCanvas.height, el.getBoundingClientRect());
      if (disposed) return;
      bindTex(0, sceneTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, sceneCanvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      if (!sceneReady) {
        sceneReady = true;
        onReady?.();
      }
      kick();
    };

    // Zeiger erzeugt Wellen
    const pointer = { x: 0, y: 0, px: -1, py: -1, active: false };
    const target = interactiveRef?.current || el;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = 1 - (e.clientY - r.top) / r.height;
      pointer.active = true;
      kick();
    };
    const onDown = (e) => {
      onMove(e);
      drop(pointer.x, pointer.y, 0.05, 0.03);
    };
    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerdown", onDown, { passive: true });

    let lastAuto = 0;
    const start = performance.now();
    const frame = (now) => {
      raf = 0;
      if (disposed || !sceneReady) return;

      if (pointer.active) {
        const moved = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
        if (moved > 0.002) {
          drop(pointer.x, pointer.y, 0.022, Math.min(0.012, 0.004 + moved * 0.25));
          pointer.px = pointer.x;
          pointer.py = pointer.y;
        }
      }
      // Ab und zu ein einzelner Tropfen, damit die Fläche lebt
      if (now - lastAuto > 2600) {
        lastAuto = now;
        drop(0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7, 0.03, 0.02);
      }

      step();
      pass(progs.render, null, (u) => {
        bindTex(0, a.tex);
        bindTex(1, sceneTex);
        gl.uniform1i(u.water, 0);
        gl.uniform1i(u.scene, 1);
        gl.uniform1f(u.time, (now - start) / 1000);
      });

      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible && sceneReady) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(el);
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });
    ro.observe(el);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);

    (document.fonts?.ready || Promise.resolve()).then(resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Einmalig aufbauen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
