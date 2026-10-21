import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OddlyTownReel01"
      component={Reel}
      // Shots sum to 624 frames, minus 3 fades of 8 frames.
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ music: true, sfx: true }}
    />
  );
};
