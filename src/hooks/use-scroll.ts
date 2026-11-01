"use client";
import { useCallback, useEffect, useState } from "react";

// Adaptado do hook use-scroll do bloco header-1 de Efferd UI (MIT).
export function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback(() => setScrolled(window.scrollY > threshold), [threshold]);
  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return scrolled;
}
