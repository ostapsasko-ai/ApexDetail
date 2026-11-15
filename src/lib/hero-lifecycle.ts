export type HeroPhase = "waiting" | "animating" | "final";

export function canStartHero({ mounted, finalized }: { mounted: boolean; finalized: boolean }) {
  return mounted && !finalized;
}

export function getHeroControlsState(phase: HeroPhase): {
  ariaHidden: boolean;
  inert: boolean;
  tabIndex: -1 | undefined;
} {
  const interactive = phase === "final";
  return {
    ariaHidden: !interactive,
    inert: !interactive,
    tabIndex: interactive ? undefined : -1
  };
}

