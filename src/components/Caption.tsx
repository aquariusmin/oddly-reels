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

// Bottom caption inside the Reels safe area: clear of the right-hand action
// buttons and the bottom username/description block.
export const CAPTION_TOP = 1380;

type Props = {
  readonly text: string;
  readonly sub?: string;
  readonly top?: number;
  readonly size?: number;
  readonly delay?: number;
};

export const Caption: React.FC<Props> = ({
  text,
  sub,
  top = CAPTION_TOP,
  size = 72,
  delay = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const subEnter = interpolate(frame, [delay + 8, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: "absolute",
          top,
          left: 80,
          right: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: koreanFont,
            fontSize: size,
            lineHeight: 1.2,
            color: "#fffaf0",
            whiteSpace: "pre-line",
            textShadow: "0 5px 0 #1d1a2e",
            opacity: Math.min(1, enter * 1.4),
            translate: `0px ${(1 - enter) * 40}px`,
            scale: String(0.92 + 0.08 * enter),
            transformOrigin: "left bottom",
          }}
        >
          {text}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: koreanFont,
              fontSize: 40,
              color: "#1d1a2e",
              backgroundColor: "#f2c94c",
              padding: "6px 18px",
              borderRadius: 10,
              opacity: subEnter,
              translate: `${(1 - subEnter) * -24}px 0px`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
