import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { koreanFont } from "../fonts";

// Captions sit in the upper zone, above the footage card: clear of the Reels
// bottom description block and right-hand buttons, and never over the town.
export const CAPTION_TOP = 270;

type Props = {
  readonly text: string;
  readonly size?: number;
  readonly delay?: number;
  // false for the closing caption, which should stay up to the last frame.
  readonly exit?: boolean;
};

export const Caption: React.FC<Props> = ({
  text,
  size = 84,
  delay = 0,
  exit: withExit = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lines = text.split("\n");

  const exit = !withExit
    ? 0
    : interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: CAPTION_TOP,
          left: 80,
          right: 80,
          fontFamily: koreanFont,
          fontSize: size,
          lineHeight: 1.16,
          color: "#fffaf0",
          textShadow: "0 6px 0 #1d1a2e",
          opacity: 1 - exit,
          translate: `0px ${-exit * 24}px`,
        }}
      >
        {lines.map((line, i) => {
          const s = spring({
            frame: frame - delay - i * 4,
            fps,
            config: { damping: 13, stiffness: 190, mass: 0.6 },
          });
          return (
            <div
              key={line}
              style={{
                opacity: Math.min(1, s * 1.6),
                translate: `0px ${(1 - s) * 46}px`,
                scale: String(0.94 + 0.06 * s),
                transformOrigin: "left bottom",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
