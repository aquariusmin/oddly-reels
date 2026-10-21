import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Caption } from "./components/Caption";
import {
  BrandTag,
  CardNote,
  DemoBadge,
  LabBackground,
  Outro,
  Title,
} from "./components/Chrome";
import { Shot } from "./components/Shot";
import { IPHONE_DAY, SCREEN, TOWN_CENTER } from "./sources";

// Ambient town card: 560 source px wide -> 980 px = 1.75x, so every art pixel
// (4 source px) lands on exactly 7 output px.
const TOWN_CARD = { top: 600, width: 980, height: 560 };
const TOWN_CAM = { x: TOWN_CENTER.x, y: TOWN_CENTER.y, w: 560 };

export const TRANSITION_FRAMES = 9;
const cut = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

export const Reel: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <LabBackground />
      <TransitionSeries name="Shots">
        {/* 1. Real Mac, filmed on iPhone. Keyboard cropped out by the camera. */}
        <TransitionSeries.Sequence name="Real Mac" durationInFrames={84}>
          <Title text={"컴퓨터 화면에\n작은 마을을 만들어봤다"} />
          <Shot
            src={IPHONE_DAY.src}
            srcWidth={IPHONE_DAY.width}
            srcHeight={IPHONE_DAY.height}
            trimBefore={0.3 * fps}
            from={{ x: 300, y: 400, w: 470 }}
            to={{ x: 305, y: 500, w: 360 }}
            top={540}
            width={900}
            height={760}
            pixelated={false}
          >
            <DemoBadge label="시연 중" />
            <CardNote text="실제 Mac · 아이폰 촬영" />
          </Shot>
          <Caption text="진짜 내 바탕화면에 산다" delay={22} />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 2. Screen recording: zoom from the desktop into the town. */}
        <TransitionSeries.Sequence name="Zoom in" durationInFrames={66}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={0 * fps}
            from={{ x: 1470, y: 960, w: 1700 }}
            to={TOWN_CAM}
            {...TOWN_CARD}
          >
            <DemoBadge label="시연 화면" />
          </Shot>
          <Caption text={"화면 구석에 사는\n280×120 픽셀 마을"} />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 3. Demo Mode "Cycle Day & Night": day -> dusk -> night. */}
        <TransitionSeries.Sequence name="Day and night" durationInFrames={150}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={10.2 * fps}
            playbackRate={2}
            from={TOWN_CAM}
            {...TOWN_CARD}
          >
            <DemoBadge label="시간 빨리감기 · 2배속" />
          </Shot>
          <Caption text={"시간이 흐르면\n낮 → 노을 → 밤"} />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 4a. The Developer menu click, so the change is visibly a demo. */}
        <TransitionSeries.Sequence name="Demo menu" durationInFrames={48}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={51.1 * fps}
            from={{ x: 1800, y: 600, w: 1300 }}
            to={{ x: 1640, y: 830, w: 760 }}
            top={500}
            width={980}
            height={760}
          >
            <DemoBadge label="Demo Mode 메뉴" />
          </Shot>
          <Caption text="개발을 하면...?" />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 4b. The workshop that appeared, with chimney smoke. */}
        <TransitionSeries.Sequence name="Workshop" durationInFrames={90}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={53.2 * fps}
            from={TOWN_CAM}
            to={{ x: 1600, y: 990, w: 420 }}
            {...TOWN_CARD}
          >
            <DemoBadge label="즉시 전환" />
          </Shot>
          <Caption text={"연기 나는 공방이 뚝딱"} sub="작업 종류마다 다른 건물" />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 5. Town Mode: placing decorations in the four front spots. */}
        <TransitionSeries.Sequence name="Town Mode" durationInFrames={150}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={96.5 * fps}
            playbackRate={2.6}
            from={{ x: 1470, y: 843, w: 1720 }}
            top={560}
            width={980}
            height={640}
          >
            <DemoBadge label="2.6배속" />
          </Shot>
          <Caption text="Town Mode에서 꾸미기" sub="벤치 · 화분 · 묘목" />
        </TransitionSeries.Sequence>
        {cut()}

        {/* 6. Level 3 town with residents, then the brand. */}
        <TransitionSeries.Sequence name="Outro" durationInFrames={105}>
          <Shot
            src={SCREEN.src}
            srcWidth={SCREEN.width}
            srcHeight={SCREEN.height}
            trimBefore={117.8 * fps}
            from={{ x: 1470, y: 975, w: 600 }}
            to={TOWN_CAM}
            {...TOWN_CARD}
          >
            <DemoBadge label="Level 3 미리보기" />
          </Shot>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandTag label="EXP 01" />
    </AbsoluteFill>
  );
};
