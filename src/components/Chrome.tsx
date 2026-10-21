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

// Opening title above the first shot.
export const Title: React.FC<{ readonly text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 80,
          right: 80,
          fontFamily: koreanFont,
          fontSize: 88,
          lineHeight: 1.18,
          color: CREAM,
          textShadow: `0 6px 0 ${INK}`,
        }}
      >
        {lines.map((line, i) => {
          const s = spring({
            frame: frame - 3 - i * 6,
            fps,
            config: { damping: 12, stiffness: 170, mass: 0.6 },
          });
          return (
            <div
              key={line}
              style={{
                opacity: Math.min(1, s * 1.5),
                translate: `0px ${(1 - s) * 50}px`,
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

// Disclosure shown on every Demo Mode shot, pinned to the card's top-right.
export const DemoBadge: React.FC<{ readonly label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [2, 10], [0, 1], {
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
        scale: String(0.8 + 0.2 * pop),
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

// Closing brand card.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 1340,
          left: 80,
          right: 140,
          opacity: Math.min(1, s * 1.4),
          translate: `0px ${(1 - s) * 40}px`,
        }}
      >
        <div
          style={{
            fontFamily: koreanFont,
            fontSize: 68,
            color: CREAM,
            textShadow: `0 5px 0 ${INK}`,
          }}
        >
          마을은 계속 자라는 중
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: pixelFont,
            fontSize: 44,
            color: YELLOW,
          }}
        >
          @oddly.entp
        </div>
      </div>
    </AbsoluteFill>
  );
};
