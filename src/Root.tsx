import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OddlyTownReel01"
      component={Reel}
      // 6 shots summing to 693 frames, minus 6 fades of 9 frames.
      durationInFrames={639}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
