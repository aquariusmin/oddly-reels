import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Caption } from "./components/Caption";
import {
  BrandTag,
  CardNote,
  DemoBadge,
  Handle,
  LabBackground,
  LevelChip,
} from "./components/Chrome";
import { Shot } from "./components/Shot";
import { IPHONE_DAY, SCREEN, TOWN_CAM, TOWN_MODE_SCENE } from "./sources";

// Ambient town card: 980 x 560 at 1.75x (see TOWN_CAM).
const TOWN_CARD = { top: 640, width: 980, height: 560 };
const screen = {
  src: SCREEN.src,
  srcWidth: SCREEN.width,
  srcHeight: SCREEN.height,
};

const FADE = 8;
const softCut = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: FADE })}
  />
);

// Timeline (output frames, 30 fps, 600 total):
//   0–90    Hook: real Mac on iPhone
//   90–192  Zoom into the living town
//   192–348 Growth: day/night, then Lv 1 -> 2 -> 3
//   348–498 Town Mode decorating
//   498–600 Best town shot + handle
// Every screen-recording trim sits inside a window where the town is moving
// (see sources.ts); still stretches are cut out rather than played.
export const Reel: React.FC<{
  readonly music: boolean;
  readonly sfx: boolean;
}> = ({ music, sfx }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <LabBackground />

      <TransitionSeries name="Shots">
        <TransitionSeries.Sequence name="Hook: real Mac" durationInFrames={98}>
          {/* Keyboard is below the camera's frame; only the screen is shown. */}
          <Shot
            src={IPHONE_DAY.src}
            srcWidth={IPHONE_DAY.width}
            srcHeight={IPHONE_DAY.height}
            trimBefore={0.3 * fps}
            zoomFrom={{ x: 280, y: 430, w: 460 }}
            camera={{ x: 305, y: 505, w: 380 }}
            top={560}
            width={980}
            height={860}
            pixelated={false}
          >
            <DemoBadge label="모드로 촬영" />
            <CardNote text="실제 Mac 화면 · iPhone 촬영" />
          </Shot>
        </TransitionSeries.Sequence>
        {softCut()}

        {/* Ends at 56.2 s: a menu opens over the town at 56.3 s. */}
        <TransitionSeries.Sequence name="Living town" durationInFrames={102}>
          <Shot
            {...screen}
            trimBefore={52.8 * fps}
            zoomFrom={{ x: 1470, y: 980, w: 1700 }}
            camera={TOWN_CAM}
            moveFrames={60}
            {...TOWN_CARD}
          >
            <DemoBadge label="모드 화면" />
          </Shot>
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Day and night" durationInFrames={104}>
          {/* Three parts at 3x, skipping the still moments at 13.1–13.4 s and
              18.0–18.5 s. */}
          <Sequence name="Day" durationInFrames={34}>
            <Shot
              {...screen}
              trimBefore={9.7 * fps}
              playbackRate={3}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <DemoBadge label="하루를 몇 초로 압축" />
            </Shot>
          </Sequence>
          <Sequence name="Dusk" from={34} durationInFrames={46}>
            <Shot
              {...screen}
              trimBefore={13.4 * fps}
              playbackRate={3}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <DemoBadge label="하루를 몇 초로 압축" />
            </Shot>
          </Sequence>
          <Sequence name="Night" from={80} durationInFrames={24}>
            <Shot
              {...screen}
              trimBefore={18.5 * fps}
              playbackRate={3}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <DemoBadge label="하루를 몇 초로 압축" />
            </Shot>
          </Sequence>
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Growth" durationInFrames={60}>
          <Sequence name="Lv 1" durationInFrames={18}>
            <Shot
              {...screen}
              trimBefore={11 * fps}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <LevelChip level={1} />
              <DemoBadge label="단계 즉시 전환" />
            </Shot>
          </Sequence>
          <Sequence name="Lv 2" from={18} durationInFrames={18}>
            <Shot
              {...screen}
              trimBefore={66 * fps}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <LevelChip level={2} />
              <DemoBadge label="단계 즉시 전환" />
              <CardNote text="실제로는 누적 2시간" />
            </Shot>
          </Sequence>
          <Sequence name="Lv 3" from={36} durationInFrames={24}>
            <Shot
              {...screen}
              trimBefore={117.2 * fps}
              camera={TOWN_CAM}
              {...TOWN_CARD}
            >
              <LevelChip level={3} />
              <DemoBadge label="단계 즉시 전환" />
              <CardNote text="실제로는 누적 6시간" />
            </Shot>
          </Sequence>
        </TransitionSeries.Sequence>
        {softCut()}

        <TransitionSeries.Sequence name="Town Mode" durationInFrames={158}>
          {/* Scene at exactly 7 output px per art pixel. */}
          <Shot
            {...screen}
            trimBefore={97.4 * fps}
            playbackRate={2.2}
            camera={TOWN_MODE_SCENE}
            top={600}
            width={980}
            height={420}
          >
            <DemoBadge label="2.2배속" />
          </Shot>
          {/* Decoration panel from the same window, smooth-scaled for text. */}
          <Shot
            {...screen}
            trimBefore={97.4 * fps}
            playbackRate={2.2}
            camera={{ x: 1965, y: 1210, w: 690 }}
            top={1070}
            width={820}
            height={428}
            pixelated={false}
            radius={20}
          />
        </TransitionSeries.Sequence>
        {softCut()}

        <TransitionSeries.Sequence name="Best shot" durationInFrames={102}>
          <Shot
            {...screen}
            trimBefore={118 * fps}
            zoomFrom={{ x: 1530, y: 1000, w: 392 }}
            camera={TOWN_CAM}
            moveFrames={70}
            {...TOWN_CARD}
          >
            <DemoBadge label="모드 화면" />
          </Shot>
          <Handle />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <BrandTag label="EP.01" />

      {/* Captions run on the output clock, one per section. */}
      <Sequence name="Caption: hook" durationInFrames={90}>
        <Caption
          text={"컴퓨터 화면에\n마을을 만들어봤다."}
          size={92}
          delay={-4}
        />
      </Sequence>
      <Sequence name="Caption: alive" from={92} durationInFrames={98}>
        <Caption text={"그냥 켜두면\n알아서 살아 움직임"} />
      </Sequence>
      <Sequence name="Caption: growth" from={194} durationInFrames={152}>
        <Caption text={"내가 컴퓨터를 쓰는 동안\n같이 성장함"} size={80} />
      </Sequence>
      <Sequence name="Caption: decorate" from={350} durationInFrames={146}>
        <Caption text={"가끔은 직접\n꾸밀 수도 있고"} />
      </Sequence>
      <Sequence name="Caption: ask" from={500} durationInFrames={100}>
        <Caption text={"이거 무료로 나오면\n써볼 사람?"} exit={false} />
      </Sequence>

      {music ? (
        <Audio
          name="Music (original chiptune)"
          src={staticFile("audio/music.wav")}
          volume={(f) =>
            interpolate(f, [0, 6, 570, 600], [0, 0.55, 0.55, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}

      {sfx ? (
        <>
          <Sequence name="SFX: hook pop" from={0} layout="none">
            <Audio src={staticFile("audio/pop.wav")} volume={0.75} />
          </Sequence>
          <Sequence name="SFX: zoom" from={84} layout="none">
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.83} />
          </Sequence>
          <Sequence name="SFX: alive pop" from={94} layout="none">
            <Audio src={staticFile("audio/pop.wav")} volume={0.68} />
          </Sequence>
          <Sequence name="SFX: day/night" from={192} layout="none">
            <Audio src={staticFile("audio/click.wav")} volume={0.75} />
          </Sequence>
          <Sequence name="SFX: growth pop" from={196} layout="none">
            <Audio src={staticFile("audio/pop.wav")} volume={0.68} />
          </Sequence>
          <Sequence name="SFX: Lv 1" from={296} layout="none">
            <Audio src={staticFile("audio/sparkle.wav")} volume={0.52} />
          </Sequence>
          <Sequence name="SFX: Lv 2" from={314} layout="none">
            <Audio src={staticFile("audio/sparkle.wav")} volume={0.6} />
          </Sequence>
          <Sequence name="SFX: Lv 3" from={332} layout="none">
            <Audio src={staticFile("audio/sparkle.wav")} volume={0.75} />
          </Sequence>
          <Sequence name="SFX: decorate pop" from={352} layout="none">
            <Audio src={staticFile("audio/pop.wav")} volume={0.68} />
          </Sequence>
          {/* Clicks land on the real picks: 98.7 s, 100.7 s, 106.7 s in source. */}
          <Sequence name="SFX: bench" from={366} layout="none">
            <Audio src={staticFile("audio/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence name="SFX: flower box" from={393} layout="none">
            <Audio src={staticFile("audio/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence name="SFX: sapling" from={474} layout="none">
            <Audio src={staticFile("audio/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence name="SFX: outro" from={500} layout="none">
            <Audio src={staticFile("audio/chime.wav")} volume={0.75} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
