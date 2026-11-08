"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { shouldPlayIntro } from "@/lib/intro";

const SESSION_KEY = "apexdetail-intro-seen";

export function RacingIntro() {
  const [active, setActive] = useState<boolean | null>(null);
  const root = useRef<HTMLDivElement>(null); const car = useRef<HTMLDivElement>(null); const trail = useRef<HTMLDivElement>(null); const logo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const play = shouldPlayIntro({ seen: sessionStorage.getItem(SESSION_KEY) === "1", reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
    if (!play) { setActive(false); return; }
    sessionStorage.setItem(SESSION_KEY, "1"); setActive(true);
  }, []);

  useEffect(() => {
    if (!active || !root.current || !car.current || !logo.current || !trail.current) return;
    try {
      const timeline = gsap.timeline({ onComplete: () => setActive(false) });
      timeline.set(car.current, { x: "-85vw", opacity: 1 }).set(trail.current, { scaleX: 0, opacity: 0 }).set(logo.current, { opacity: 0, scale: .94 })
        .to(car.current, { x: "20vw", duration: .9, ease: "power2.in" })
        .to(trail.current, { scaleX: 1, opacity: .9, duration: .38, ease: "power1.out" }, "<.25")
        .to(car.current, { x: "125vw", duration: .85, ease: "power3.in" })
        .to(trail.current, { opacity: 0, duration: .28 }, "<.5")
        .to(logo.current, { opacity: 1, scale: 1, duration: .36, ease: "power2.out" }, "<-.2")
        .to(root.current, { opacity: 0, duration: .36, delay: .25 });
      return () => { timeline.kill(); };
    } catch { setActive(false); }
  }, [active]);

  if (active === false) return null;
  return <div className={`racing-intro ${active === null ? "racing-intro--checking" : ""}`} ref={root} role="dialog" aria-label="Intro ApexDetail" aria-live="polite"><button type="button" onClick={() => setActive(false)}>Pomiń intro</button>{active && <><div className="racing-intro__track" /><div className="racing-intro__trail" ref={trail} /><div className="racing-intro__car" ref={car}><Image src="/generated/apexdetail-racing-car.png" alt="Fikcyjny, niebrandowany bolid wyścigowy" width={1904} height={768} priority /></div><div className="racing-intro__logo" ref={logo}><span>A</span><strong>APEX<em>DETAIL</em></strong><small>Precyzja w ruchu</small></div></>}</div>;
}

