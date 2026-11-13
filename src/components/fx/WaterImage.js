"use client";

import { useEffect, useRef } from "react";

// Ein Bild „unter Wasser“: ruhige Lichtbrechung, eine feine Welle am Mauszeiger
// und ein Bildwechsel, bei dem das neue Bild wie ein steigender Wasserspiegel
// aufkommt. Eine einzige WebGL-Fläche, rendert nur, solange sie sichtbar ist.

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D t0;
uniform sampler2D t1;
uniform vec2 r0;
uniform vec2 r1;
uniform vec2 res;
uniform float time;
uniform float prog;
uniform vec2 mouse;
uniform float mstr;
uniform float calm;

vec2 cover(vec2 uv, vec2 img) {
  float rs = res.x / res.y;
  float ri = img.x / img.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s + 0.5;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vUv;
  float t = time * 0.35;

  // Ruhige Lichtbrechung wie durch eine Wasseroberfläche
  vec2 flow = vec2(
    sin(uv.y * 9.0 + t * 1.3) + 0.4 * sin(uv.y * 23.0 - t * 0.9),
    cos(uv.x * 8.0 + t) + 0.4 * cos(uv.x * 19.0 + t * 1.4)
  ) * 0.0014 * calm;

  // Welle am Mauszeiger
  vec2 d = uv - mouse;
  d.x *= res.x / res.y;
  float dist = length(d);
  float ripple = sin(dist * 70.0 - time * 6.0) * exp(-dist * 10.0) * mstr;
  vec2 rip = (d / (dist + 0.0001)) * ripple * 0.006;

  // Bildwechsel: ein Wasserspiegel steigt von unten
  float n = noise(vec2(uv.x * 4.0, time * 0.4));
  float level = prog * 1.3 - 0.15;
  float surface = level + (n - 0.5) * 0.08 + sin(uv.x * 14.0 + time * 2.2) * 0.012;
  float m = 1.0 - smoothstep(surface - 0.02, surface + 0.02, uv.y);
  float band = 1.0 - clamp(abs(uv.y - surface) * 9.0, 0.0, 1.0);
  vec2 lift = vec2(0.0, band * 0.035 * (1.0 - prog) * step(0.001, prog));

  vec4 c0 = texture2D(t0, cover(uv + flow + rip - lift, r0));
  vec4 c1 = texture2D(t1, cover(uv + flow + rip + lift, r1));
  vec4 col = mix(c0, c1, m);

  // Ein Hauch Licht auf der Wasserlinie während des Wechsels
  col.rgb += band * 0.08 * step(0.001, prog) * (1.0 - prog);

  gl_FragColor = col;
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

function loadTexture(gl, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve({ tex, w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function WaterImage({ sources, index, onReady, className }) {
  const canvas = useRef(null);
  const api = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    for (const n of ["t0", "t1", "r0", "r1", "res", "time", "prog", "mouse", "mstr", "calm"]) {
      u[n] = gl.getUniformLocation(prog, n);
    }
    gl.uniform1i(u.t0, 0);
    gl.uniform1i(u.t1, 1);
    gl.uniform1f(u.calm, reduce ? 0 : 1);

    const textures = [];
    let cur = 0;
    let next = 0;
    let transition = 0; // 0..1
    let transStart = 0;
    let visible = false;
    let raf = 0;
    let disposed = false;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, s: 0, ts: 0 };
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(u.res, w, h);
    };

    const bind = (unit, t) => {
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.uniform2f(unit === 0 ? u.r0 : u.r1, t.w, t.h);
    };

    const frame = (now) => {
      raf = 0;
      if (disposed) return;
      const t = (now - start) / 1000;
      if (transition > 0) {
        const p = Math.min(1, (now - transStart) / 1700);
        transition = p === 1 ? 0 : p;
        if (p === 1) cur = next;
      }
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.ts *= 0.96;
      mouse.s += (mouse.ts - mouse.s) * 0.1;

      if (textures[cur]) bind(0, textures[cur]);
      if (textures[next]) bind(1, textures[transition > 0 ? next : cur]);
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.prog, transition > 0 ? ease(transition) : 0);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.mstr, mouse.s);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (visible && !document.hidden && (!reduce || transition > 0)) raf = requestAnimationFrame(frame);
    };
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const kick = () => {
      if (!raf && textures[cur]) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(el);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      mouse.ts = Math.min(1, mouse.ts + 0.12);
      kick();
    };
    if (fine && !reduce) el.parentElement.addEventListener("pointermove", onMove, { passive: true });

    api.current = {
      show(i) {
        if (i === cur && transition === 0) return;
        if (!textures[i]) return;
        if (reduce) {
          cur = next = i;
          kick();
          return;
        }
        if (transition > 0) cur = next;
        next = i;
        transition = 0.0001;
        transStart = performance.now();
        kick();
      },
    };

    resize();
    // Erst das aktuelle Bild, dann die übrigen nachladen.
    loadTexture(gl, sources[0])
      .then((t) => {
        if (disposed) return;
        textures[0] = t;
        kick();
        onReady?.();
        sources.slice(1).forEach((src, k) =>
          loadTexture(gl, src).then((tt) => {
            if (!disposed) textures[k + 1] = tt;
          }),
        );
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.parentElement?.removeEventListener("pointermove", onMove);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
    // Quellen ändern sich nicht zur Laufzeit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.current?.show(index);
  }, [index]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
