import { describe, expect, it } from "vitest";
import { shouldPlayIntro } from "./intro";

describe("shouldPlayIntro", () => {
  it("odtwarza intro przy pierwszej wizycie w sesji", () => {
    expect(shouldPlayIntro({ seen: false, reducedMotion: false })).toBe(true);
  });
  it("nie odtwarza ponownie w tej samej sesji", () => {
    expect(shouldPlayIntro({ seen: true, reducedMotion: false })).toBe(false);
  });
  it("szanuje prefers-reduced-motion", () => {
    expect(shouldPlayIntro({ seen: false, reducedMotion: true })).toBe(false);
  });
});
