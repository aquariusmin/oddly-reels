import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// A virtual camera over a source video. The card shows the source region
// centred on (x, y) that is `w` source pixels wide.
export type Camera = { x: number; y: number; w: number };

type Props = {
  readonly src: string;
  readonly srcWidth: number;
  readonly srcHeight: number;
  readonly trimBefore: number;
  readonly playbackRate?: number;
  // Where the camera settles. For pixel art, pick `w` so width / w maps one art
  // pixel to a whole number of output pixels, and align the edges to the grid.
  readonly camera: Camera;
  // Optional starting camera; eases into `camera` over `moveFrames`.
  readonly zoomFrom?: Camera;
  readonly moveFrames?: number;
  // Card box in composition pixels (centred horizontally unless `left` given).
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly left?: number;
  // Nearest-neighbour sampling for pixel art; off for camera footage.
  readonly pixelated?: boolean;
  readonly radius?: number;
  readonly children?: React.ReactNode;
};

export const Shot: React.FC<Props> = ({
  src,
  srcWidth,
  srcHeight,
  trimBefore,
  playbackRate = 1,
  camera,
  zoomFrom,
  moveFrames,
  top,
  width,
  height,
  left,
  pixelated = true,
  radius = 28,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: compWidth } = useVideoConfig();

  // The video is drawn once at the settled camera's scale, so the resting
  // frame is pixel-exact. Camera moves are applied as a transform on that
  // layer, which the compositor scales smoothly instead of re-sampling the
  // pixel art every frame (the cause of the "crawling" jitter).
  const baseScale = width / camera.w;
  const start = zoomFrom ?? camera;
  const p = interpolate(
    frame,
    [0, (moveFrames ?? durationInFrames) - 1],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.15, 1),
    },
  );
  // Zoom in log space so the speed feels even.
  const w = Math.exp(
    Math.log(start.w) + (Math.log(camera.w) - Math.log(start.w)) * p,
  );
  const x = start.x + (camera.x - start.x) * p;
  const y = start.y + (camera.y - start.y) * p;
  const s = width / w;
  const k = camera.w / w;
  const moving = p < 1 && zoomFrom !== undefined;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top,
          left: left ?? (compWidth - width) / 2,
          width,
          height,
          overflow: "hidden",
          borderRadius: radius,
          backgroundColor: "#4a4a4a",
          boxShadow:
            "0 0 0 6px #1d1a2e, 0 0 0 12px #f2c94c, 0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 50%",
            transform: moving
              ? `translate(${(camera.x - x) * s}px, ${(camera.y - y) * s}px) scale(${k})`
              : undefined,
            willChange: zoomFrom ? "transform" : undefined,
          }}
        >
          <Video
            src={src}
            trimBefore={trimBefore}
            playbackRate={playbackRate}
            muted
            style={{
              position: "absolute",
              width: srcWidth * baseScale,
              height: srcHeight * baseScale,
              maxWidth: "none",
              left: width / 2 - camera.x * baseScale,
              top: height / 2 - camera.y * baseScale,
              imageRendering: pixelated ? "pixelated" : "auto",
            }}
          />
        </div>
        {children}
      </div>
    </AbsoluteFill>
  );
};
