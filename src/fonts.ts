import { loadFont as loadJua } from "@remotion/google-fonts/Jua";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";

// Jua: rounded Korean display face for captions.
export const { fontFamily: koreanFont } = loadJua("normal", {
  weights: ["400"],
});

// Silkscreen: pixel face for Latin labels (no Hangul glyphs).
export const { fontFamily: pixelFont } = loadSilkscreen("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
