import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// A virtual camera over a source video: the card shows the source region centred
// on (x, y) that is `w` source pixels wide. The camera eases from `from` to `to`
// over the shot.
export type Camera = { x: number; y: number; w: number };

type Props = {
  readonly src: string;
  readonly srcWidth: number;
  readonly srcHeight: number;
  readonly trimBefore: number;
  readonly playbackRate?: number;
  readonly from: Camera;
  readonly to?: Camera;
  // Card box in composition pixels.
  readonly top: number;
  readonly width: number;
  readonly height: number;
  // Nearest-neighbour scaling for pixel art; off for camera footage.
  readonly pixelated?: boolean;
  readonly children?: React.ReactNode;
};

export const Shot: React.FC<Props> = ({
  src,
  srcWidth,
  srcHeight,
  trimBefore,
  playbackRate = 1,
  from,
  to = from,
  top,
  width,
  height,
  pixelated = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: compWidth } = useVideoConfig();

  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const camX = from.x + (to.x - from.x) * t;
  const camY = from.y + (to.y - from.y) * t;
  const camW = from.w + (to.w - from.w) * t;
  const scale = width / camW;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top,
          left: (compWidth - width) / 2,
          width,
          height,
          overflow: "hidden",
          borderRadius: 28,
          backgroundColor: "#4a4a4a",
          boxShadow: "0 0 0 6px #1d1a2e, 0 0 0 12px #f2c94c, 0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        <Video
          src={src}
          trimBefore={trimBefore}
          playbackRate={playbackRate}
          muted
          style={{
            position: "absolute",
            width: srcWidth * scale,
            height: srcHeight * scale,
            maxWidth: "none",
            left: width / 2 - camX * scale,
            top: height / 2 - camY * scale,
            imageRendering: pixelated ? "pixelated" : "auto",
          }}
        />
        {children}
      </div>
    </AbsoluteFill>
  );
};
