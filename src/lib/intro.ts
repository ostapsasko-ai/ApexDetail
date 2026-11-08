export function shouldPlayIntro({ seen, reducedMotion }: { seen: boolean; reducedMotion: boolean }) {
  return !seen && !reducedMotion;
}

