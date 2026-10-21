import { staticFile } from "remotion";

// Original footage in public/ is read-only: referenced by its real name, never renamed.

// iPhone shot of the Mac (daytime wallpaper, town in Ambient Mode). 512x910, 11s.
export const IPHONE_DAY = {
  src: staticFile("IMG_9534.mp4"),
  width: 512,
  height: 910,
};

// iPhone shot of the Mac (night wallpaper). 512x910, 48s. Kept for alternate cuts.
export const IPHONE_NIGHT = {
  src: staticFile("IMG_9535.mp4"),
  width: 512,
  height: 910,
};

// Mac screen recording, 2940x1912 (Retina), 2:04, Demo Mode.
// Timestamps used in the edit (seconds in this file):
//   0–4     Ambient town at night
//   10–21   "Cycle Day & Night": day -> dusk -> night
//   51–53   Developer menu: "Development -> Workshop" clicked
//   53–57   Workshop with chimney smoke
//   95–113  Town Mode window: Spot 1 -> Bench, Spot 2 -> Flower box, Spot 4 -> Sapling
//   117.5+  Level 3 town with residents
export const SCREEN = {
  src: staticFile("화면 기록 2026-10-22 오전 2.11.40.mov"),
  width: 2940,
  height: 1912,
};

// Ambient town position inside SCREEN (source pixels). 1 art pixel = 4 source px.
export const TOWN_CENTER = { x: 1470, y: 975 };
