import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { koreanFont, pixelFont } from "../fonts";

const INK = "#1d1a2e";
const CREAM = "#fffaf0";
const YELLOW = "#f2c94c";

// "Lab bench" backdrop: deep purple with a faint pixel grid that drifts slowly.
export const LabBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#2b2540",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
        backgroundSize: "48px 48px",
        backgroundPosition: `0px ${(frame * 0.6) % 48}px`,
      }}
    />
  );
};

// Brand tag, below the Reels top bar.
export const BrandTag: React.FC<{ readonly label: string }> = ({ label }) => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: pixelFont,
        fontSize: 34,
        color: CREAM,
        letterSpacing: 1,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          backgroundColor: YELLOW,
          boxShadow: `4px 4px 0 ${INK}`,
        }}
      />
      ODDLY ENTP
      <span style={{ color: YELLOW }}>· {label}</span>
    </div>
  </AbsoluteFill>
);

// Disclosure shown on every Demo Mode shot, pinned to the card's top-right.
export const DemoBadge: React.FC<{ readonly label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        right: 18,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        borderRadius: 10,
        backgroundColor: "rgba(29,26,46,0.88)",
        border: `3px solid ${YELLOW}`,
        opacity: pop,
        scale: String(0.85 + 0.15 * pop),
      }}
    >
      <span style={{ fontFamily: pixelFont, fontSize: 26, color: YELLOW }}>
        DEMO
      </span>
      <span style={{ fontFamily: koreanFont, fontSize: 28, color: CREAM }}>
        {label}
      </span>
    </div>
  );
};

// Small label on the card's bottom-left, e.g. footage source.
export const CardNote: React.FC<{ readonly text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: 18,
      bottom: 18,
      padding: "6px 14px",
      borderRadius: 10,
      backgroundColor: "rgba(29,26,46,0.85)",
      fontFamily: koreanFont,
      fontSize: 28,
      color: CREAM,
    }}
  >
    {text}
  </div>
);

// Big pixel "LV n" stamp for the growth montage.
export const LevelChip: React.FC<{ readonly level: number }> = ({ level }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.5 },
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        padding: "6px 18px 10px",
        backgroundColor: YELLOW,
        color: INK,
        fontFamily: pixelFont,
        fontWeight: 700,
        fontSize: 56,
        boxShadow: `6px 6px 0 ${INK}`,
        scale: String(0.6 + 0.4 * s),
        rotate: `${(1 - s) * -12}deg`,
        transformOrigin: "left top",
      }}
    >
      LV {level}
    </div>
  );
};

// Handle under the closing card.
export const Handle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 1250,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelFont,
          fontSize: 48,
          color: YELLOW,
          opacity: Math.min(1, s * 1.5),
          translate: `0px ${(1 - s) * 30}px`,
        }}
      >
        @oddly.entp
      </div>
    </AbsoluteFill>
  );
};
