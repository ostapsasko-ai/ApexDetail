"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { RACING_INTRO_COMPLETE_EVENT, RACING_INTRO_COMPLETE_SESSION_KEY, RACING_INTRO_SESSION_KEY, shouldPlayIntro } from "@/lib/intro";

export function RacingIntro() {
  const [active, setActive] = useState<boolean | null>(null);
  const root = useRef<HTMLDivElement>(null); const car = useRef<HTMLDivElement>(null); const trail = useRef<HTMLDivElement>(null); const logo = useRef<HTMLDivElement>(null);
  const completionPublished = useRef(false);

  const finishIntro = useCallback(() => {
    if (completionPublished.current) return;
    completionPublished.current = true;
    sessionStorage.setItem(RACING_INTRO_SESSION_KEY, "1");
    sessionStorage.setItem(RACING_INTRO_COMPLETE_SESSION_KEY, "1");
    window.dispatchEvent(new Event(RACING_INTRO_COMPLETE_EVENT));
    setActive(false);
  }, []);

  useEffect(() => {
    const play = shouldPlayIntro({ seen: sessionStorage.getItem(RACING_INTRO_SESSION_KEY) === "1", reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
    if (!play) { finishIntro(); return; }
    sessionStorage.setItem(RACING_INTRO_SESSION_KEY, "1"); setActive(true);
  }, [finishIntro]);

  useEffect(() => {
    if (!active || !root.current || !car.current || !logo.current || !trail.current) return;
    try {
      const timeline = gsap.timeline({ onComplete: finishIntro });
      timeline.set(car.current, { x: "-85vw", opacity: 1 }).set(trail.current, { scaleX: 0, opacity: 0 }).set(logo.current, { opacity: 0, scale: .94 })
        .to(car.current, { x: "20vw", duration: .9, ease: "power2.in" })
        .to(trail.current, { scaleX: 1, opacity: .9, duration: .38, ease: "power1.out" }, "<.25")
        .to(car.current, { x: "125vw", duration: .85, ease: "power3.in" })
        .to(trail.current, { opacity: 0, duration: .28 }, "<.5")
        .to(logo.current, { opacity: 1, scale: 1, duration: .36, ease: "power2.out" }, "<-.2")
        .to(root.current, { opacity: 0, duration: .36, delay: .25 });
      return () => { timeline.kill(); };
    } catch { finishIntro(); }
  }, [active, finishIntro]);

  if (active === false) return null;
  return <div className={`racing-intro ${active === null ? "racing-intro--checking" : ""}`} ref={root} role="dialog" aria-label="Intro ApexDetail" aria-live="polite"><button type="button" onClick={finishIntro}>Pomiń intro</button>{active && <><div className="racing-intro__track" /><div className="racing-intro__trail" ref={trail} /><div className="racing-intro__car" ref={car}><Image src="/generated/apexdetail-racing-car.png" alt="Fikcyjny, niebrandowany bolid wyścigowy" width={1904} height={768} priority /></div><div className="racing-intro__logo" ref={logo}><span>A</span><strong>APEX<em>DETAIL</em></strong><small>Precyzja w ruchu</small></div></>}</div>;
}


