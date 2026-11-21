"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

// Text baut sich Wort für Wort auf, sobald er ins Bild kommt.
// Erwartet Text (Strings) und optional <span>-Hervorhebungen als Kinder.
function split(node, keyBase, counter) {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return part;
      const n = counter.i++;
      return (
        <span key={`${keyBase}-${i}`} className={styles.w}>
          <span style={{ "--n": n }}>{part}</span>
        </span>
      );
    });
  }
  if (isValidElement(node)) {
    return cloneElement(node, {
      key: keyBase,
      children: Children.map(node.props.children, (c, i) => split(c, `${keyBase}-${i}`, counter)),
    });
  }
  return node;
}

export default function Reveal({ as: Tag = "span", children, className = "", delay = 0, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const counter = { i: 0 };
  const content = Children.map(children, (c, i) => split(c, `r${i}`, counter));

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-shown={shown || undefined}
      style={{ "--delay": `${delay}ms` }}
      {...rest}
    >
      {content}
    </Tag>
  );
}
