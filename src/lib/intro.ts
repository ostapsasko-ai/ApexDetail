export const RACING_INTRO_SESSION_KEY = "apexdetail-intro-seen";
export const RACING_INTRO_COMPLETE_SESSION_KEY = "apexdetail-racing-intro-complete";
export const RACING_INTRO_COMPLETE_EVENT = "apexdetail:racing-intro-complete";
export const HERO_INTRO_SESSION_KEY = "apexdetail-cinematic-hero-seen";

export function shouldPlayIntro({ seen, reducedMotion }: { seen: boolean; reducedMotion: boolean }) {
  return !seen && !reducedMotion;
}

export function decideHeroPlayback({ seen, reducedMotion }: { seen: boolean; reducedMotion: boolean }): "animate" | "final" {
  return seen || reducedMotion ? "final" : "animate";
}

export function shouldWaitForRacingIntro({ racingComplete, reducedMotion }: { racingComplete: boolean; reducedMotion: boolean }) {
  return !racingComplete && !reducedMotion;
}


