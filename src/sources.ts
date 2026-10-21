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

// Mac screen recording, 2940x1912 (Retina), 2:04, Demo Mode. Variable frame
// rate: macOS only records when the screen changes; the town redraws ~12 FPS.
// The town only moves in bursts; these windows have motion (seconds):
//   9.6–17.5  Level 1, "Cycle Day & Night": day -> dusk -> night
//   52.8–57   Level 2 workshop, chimney smoke
//   65–70.5   Level 2 residents walking
//   95–113    Town Mode window. Decoration picks land at 98.7 (Spot 1 Bench),
//             100.7 (Spot 2 Flower box), 106.7 (Spot 4 Sapling)
//   117–121.5 Level 3 town with residents
// 60.5–64.5, 71–87 and 121.5+ are still frames (animation paused).
// The menu bar (clock, status icons) is at y < 60 and never inside a crop.
export const SCREEN = {
  src: staticFile("화면 기록 2026-10-22 오전 2.11.40.mov"),
  width: 2940,
  height: 1912,
};

// Ambient town in SCREEN: art starts at (1190, 864), 1 art pixel = 4 source px.
// Width 560 at 1.75x -> 7 output px per art pixel; centre keeps edges on grid.
export const TOWN_CAM = { x: 1470, y: 980, w: 560 };

// Town Mode scene in SCREEN: 1680x720 at (630, 293), 1 art pixel = 12 source
// px. At 980 px wide (7/12 scale) every art pixel is exactly 7 output px.
export const TOWN_MODE_SCENE = { x: 630 + 840, y: 293 + 360, w: 1680 };
