"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { type CSSProperties, useCallback, useLayoutEffect, useRef, useState } from "react";

import { createOilRenderer, getOilRenderProfile, type OilRenderer } from "@/components/home/oil-webgl";
import {
  HERO_INTRO_SESSION_KEY,
  RACING_INTRO_COMPLETE_EVENT,
  RACING_INTRO_COMPLETE_SESSION_KEY,
  decideHeroPlayback,
  shouldWaitForRacingIntro
} from "@/lib/intro";
import { canStartHero, getHeroControlsState, type HeroPhase } from "@/lib/hero-lifecycle";

const HERO_LABEL = "Precyzja, którą widać w świetle.";
const HERO_LINES = ["Precyzja,", "którą widać", "w świetle."] as const;
const DROPLETS = Array.from({ length: 18 }, (_, index) => ({
  x: 8 + ((index * 29) % 88),
  y: 20 + ((index * 17) % 68),
  size: 5 + ((index * 7) % 14),
  delay: (index % 6) * 0.08
}));

type HeroTimeline = { kill(): void; progress(value: number): unknown };

export function CinematicHero() {
  const [phase, setPhase] = useState<HeroPhase>("final");
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<HTMLSpanElement[]>([]);
  const dropletRefs = useRef<HTMLSpanElement[]>([]);
  const rendererRef = useRef<OilRenderer | null>(null);
  const timelineRef = useRef<HeroTimeline | null>(null);
  const finalizedRef = useRef(false);
  const cancelPendingRef = useRef<() => void>(() => undefined);

  const finalize = useCallback(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    cancelPendingRef.current();
    sessionStorage.setItem(HERO_INTRO_SESSION_KEY, "1");
    rendererRef.current?.settle();
    setPhase("final");
  }, []);

  useLayoutEffect(() => {
    let mounted = true;
    let startRequested = false;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroSeen = sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === "1";
    const playback = decideHeroPlayback({ seen: heroSeen, reducedMotion });

    if (playback === "final") {
      finalize();
      return;
    }

    const startAnimation = async () => {
      if (startRequested || !canStartHero({ mounted, finalized: finalizedRef.current })) return;
      startRequested = true;
      window.removeEventListener(RACING_INTRO_COMPLETE_EVENT, startAnimation);
      setPhase("animating");

      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) {
        finalize();
        return;
      }

      const profile = getOilRenderProfile({
        width: window.innerWidth,
        devicePixelRatio: window.devicePixelRatio,
        coarsePointer: matchMedia("(pointer: coarse)").matches
      });
      const renderer = createOilRenderer(canvas, profile);
      if (!renderer) {
        root.dataset.webgl = "fallback";
        finalize();
        return;
      }
      rendererRef.current = renderer;
      root.dataset.webgl = "active";

      try {
        const { gsap } = await import("gsap");
        if (!canStartHero({ mounted, finalized: finalizedRef.current })) {
          renderer.dispose();
          if (rendererRef.current === renderer) rendererRef.current = null;
          return;
        }

        const progress = { value: 0 };
        const glyphs = glyphRefs.current;
        const droplets = dropletRefs.current.slice(0, profile.dropletCount);
        gsap.set(glyphs, {
          opacity: 0,
          y: (index: number) => 110 + (index % 5) * 22,
          x: (index: number) => ((index * 37) % 96) - 48,
          rotationX: (index: number) => 64 + (index % 4) * 21,
          rotationY: (index: number) => ((index * 47) % 150) - 75,
          rotationZ: (index: number) => ((index * 19) % 34) - 17,
          scale: 0.72,
          filter: "blur(12px) brightness(.45)"
        });
        gsap.set(droplets, { opacity: 0, scale: 0, y: 32 });
        gsap.set([copyRef.current, actionsRef.current], { opacity: 0, y: 24 });
        gsap.set(carRef.current, { opacity: 0.18, scale: 1.035, filter: "brightness(.28) saturate(.55)" });

        const timeline = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finalize });
        timelineRef.current = timeline;
        timeline
          .to(progress, {
            value: 0.72,
            duration: 3.55,
            ease: "power1.inOut",
            onUpdate: () => renderer.setProgress(progress.value)
          }, 0)
          .to(glyphs, {
            opacity: 1,
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.5,
            stagger: { each: 0.055, from: "random" },
            ease: "back.out(1.45)"
          }, 0.72)
          .to(droplets, {
            opacity: (index: number) => 0.28 + (index % 3) * 0.16,
            scale: 1,
            y: -20,
            duration: 0.48,
            stagger: 0.055,
            ease: "power2.out"
          }, 1.15)
          .to(droplets, { opacity: 0, scale: 0.35, y: -70, duration: 0.75, stagger: 0.025 }, 2.15)
          .to(carRef.current, { opacity: 1, scale: 1, filter: "brightness(1) saturate(1)", duration: 1.25, ease: "power2.out" }, 3.35)
          .to(progress, {
            value: 1,
            duration: 1.65,
            ease: "power2.inOut",
            onUpdate: () => renderer.setProgress(progress.value)
          }, 3.55)
          .to([copyRef.current, actionsRef.current], { opacity: 1, y: 0, duration: 0.62, stagger: 0.1, ease: "power2.out" }, 4.42);
      } catch {
        if (canStartHero({ mounted, finalized: finalizedRef.current })) finalize();
      }
    };

    const cancelPending = () => {
      startRequested = true;
      window.removeEventListener(RACING_INTRO_COMPLETE_EVENT, startAnimation);
    };
    cancelPendingRef.current = cancelPending;

    const racingComplete = sessionStorage.getItem(RACING_INTRO_COMPLETE_SESSION_KEY) === "1";
    if (shouldWaitForRacingIntro({ racingComplete, reducedMotion })) {
      setPhase("waiting");
      window.addEventListener(RACING_INTRO_COMPLETE_EVENT, startAnimation, { once: true });
    } else {
      void startAnimation();
    }

    return () => {
      mounted = false;
      cancelPending();
      timelineRef.current?.kill();
      rendererRef.current?.dispose();
      timelineRef.current = null;
      rendererRef.current = null;
      cancelPendingRef.current = () => undefined;
    };
  }, [finalize]);

  const skipAnimation = () => {
    timelineRef.current?.progress(1);
    finalize();
  };

  const controls = getHeroControlsState(phase);
  const controlsVisible = !controls.ariaHidden;

  return (
    <section ref={rootRef} className="cinematic-hero" data-phase={phase} aria-labelledby="cinematic-hero-heading">
      <div ref={carRef} className="cinematic-hero__car" aria-hidden="true">
        <Image
          src="/generated/apexdetail-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="cinematic-hero__car-image"
        />
      </div>
      <div className="cinematic-hero__shade" aria-hidden="true" />
      <canvas ref={canvasRef} aria-hidden="true" className="cinematic-hero__oil" />
      <div className="cinematic-hero__fallback" aria-hidden="true" />

      <div className="cinematic-hero__droplets" aria-hidden="true">
        {DROPLETS.map((drop, index) => (
          <span
            key={index}
            ref={(node) => { if (node) dropletRefs.current[index] = node; }}
            style={{ "--drop-x": `${drop.x}%`, "--drop-y": `${drop.y}%`, "--drop-size": `${drop.size}px`, "--drop-delay": drop.delay } as CSSProperties}
          />
        ))}
      </div>

      <div className="shell cinematic-hero__inner !max-w-none !px-0">
        <div className="cinematic-hero__content !w-full !max-w-none">
          <p className="eyebrow cinematic-hero__eyebrow">Warszawa · studio ochrony i renowacji</p>
          <h1 id="cinematic-hero-heading" className="cinematic-hero__title !w-full !max-w-none !text-[clamp(4.5rem,10.5vw,12rem)] !leading-[0.78]" aria-label={HERO_LABEL}>
            {HERO_LINES.map((line, lineIndex) => (
              <span key={line} data-hero-line={lineIndex + 1} aria-hidden="true" className="cinematic-hero__line !flex !w-full !justify-center !gap-[0.04em]">
                {Array.from(line).map((character, charIndex) => {
                  const glyphIndex = HERO_LINES.slice(0, lineIndex).join("").length + charIndex;
                  return (
                    <span
                      key={`${lineIndex}-${charIndex}`}
                      ref={(node) => { if (node) glyphRefs.current[glyphIndex] = node; }}
                      className="cinematic-hero__glyph"
                    >
                      {character === " " ? "\u00a0" : character}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <p ref={copyRef} className="cinematic-hero__copy" aria-hidden={!controlsVisible}>
            Korekta lakieru, powłoki ceramiczne i wnętrza prowadzone jak proces techniczny — bez skrótów i przypadkowych obietnic.
          </p>
          <div ref={actionsRef} className="cinematic-hero__actions" aria-hidden={controls.ariaHidden} inert={controls.inert}>
            <Link href="/rezerwacja" className="button" tabIndex={controls.tabIndex}>Umów oględziny <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link href="/kalkulator" className="button button--secondary" tabIndex={controls.tabIndex}>Oblicz cenę</Link>
          </div>
        </div>
      </div>

      <button type="button" className="cinematic-hero__skip" onClick={skipAnimation} hidden={controlsVisible}>
        Pomiń animację
      </button>
    </section>
  );
}
