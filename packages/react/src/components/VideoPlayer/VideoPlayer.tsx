import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactElement, ReactNode, Ref, SyntheticEvent } from "react";
import { cx } from "../../internal/cx";
import { forkRef } from "../../internal/forkRef";
import {
  CaptionsGlyph,
  FullscreenExitGlyph,
  FullscreenGlyph,
  PauseGlyph,
  PlayGlyph,
  VolumeGlyph,
  VolumeOffGlyph,
} from "../../internal/glyphs";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import styles from "./VideoPlayer.module.css";

export interface VideoChapter {
  /** Where the chapter starts, in seconds. */
  at: number;
  label: string;
}

export interface VideoCaptions {
  src: string;
  lang: string;
  /** Shown in the browser's own track menu, so it is the app's word. */
  label: string;
  defaultOn?: boolean;
}

export interface VideoPlayerLabels {
  /** Names the player itself, e.g. "Hip harness, slowly". */
  region: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
  seek: string;
}

/* Chapters and captions bring words of their own. Each is paired with the name
   of the thing it adds, so a player that has neither is asked for neither. */
type Chaptered =
  | { chapters: VideoChapter[]; chaptersLabel: string; onChapterSelect?: (at: number) => void }
  | { chapters?: undefined; chaptersLabel?: undefined; onChapterSelect?: undefined };

type Captioned = { captions: VideoCaptions; captionsLabel: string } | { captions?: undefined; captionsLabel?: undefined };

export type VideoPlayerProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  src: string;
  poster?: string;
  labels: VideoPlayerLabels;
  autoPlay?: boolean;
  /** Obscures the picture and takes away the way into it — the cover is the
      only way in while this is set. */
  covered?: boolean;
  /** Drawn over the picture, outside the blur: whatever asks to be let past. */
  cover?: ReactNode;
  ref?: Ref<HTMLElement>;
} & Chaptered &
  Captioned;

/** Far enough in to have a frame to show, short enough to still be the start. */
const FIRST_FRAME_S = 0.001;

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const whole = Math.floor(seconds);
  const s = whole % SECONDS_IN_MINUTE;
  const m = Math.floor(whole / SECONDS_IN_MINUTE) % SECONDS_IN_MINUTE;
  const h = Math.floor(whole / SECONDS_IN_HOUR);

  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/**
 * A video with its own transport: play, seek, sound, captions, fullscreen and
 * chapters. The picture can be covered — `covered` obscures it and `cover`
 * holds whatever asks to be let past, which is the app's to write.
 *
 * ```tsx
 * <VideoPlayer
 *   src={video.url}
 *   poster={video.posterUrl}
 *   labels={{ region: t("video.of", { title }), play: t("video.play"), … }}
 *   chapters={chapters}
 *   chaptersLabel={t("video.chapters")}
 * />
 * ```
 */
export function VideoPlayer({
  src,
  poster,
  labels,
  chapters,
  chaptersLabel,
  onChapterSelect,
  captions,
  captionsLabel,
  autoPlay = false,
  covered = false,
  cover,
  className,
  ref,
  ...rest
}: VideoPlayerProps): ReactElement {
  const media = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [at, setAt] = useState(0);
  const [length, setLength] = useState(0);
  const [isFullscreen, setFullscreen] = useState(false);

  function toggle() {
    const el = media.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play();
  }

  function toggleSound() {
    const el = media.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
  }

  function onMetadata(event: SyntheticEvent<HTMLVideoElement>) {
    const el = event.currentTarget;
    setLength(el.duration);
    /* Without a poster the frame is blank until the first frame is decoded, and
       a video that has been seeked already has a frame of its own. */
    if (poster === undefined && el.currentTime === 0) el.currentTime = FIRST_FRAME_S;
  }

  function goTo(seconds: number) {
    const el = media.current;
    if (el) el.currentTime = seconds;
    setAt(seconds);
  }

  function toggleCaptions() {
    const track = media.current?.textTracks?.[0];
    if (track) track.mode = track.mode === "showing" ? "disabled" : "showing";
  }

  function selectChapter(chapter: VideoChapter) {
    goTo(chapter.at);
    onChapterSelect?.(chapter.at);
  }

  useEffect(() => {
    const read = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", read);
    return () => document.removeEventListener("fullscreenchange", read);
  }, []);

  function toggleFullscreen() {
    if (isFullscreen) {
      void document.exitFullscreen?.();
      return;
    }

    const box = root.current;
    if (box?.requestFullscreen) {
      void box.requestFullscreen();
      return;
    }

    /* iPhone Safari has no element fullscreen: the video goes up on its own. */
    (media.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
  }

  return (
    <section
      className={cx(styles.player, covered && styles.covered, className)}
      aria-label={labels.region}
      ref={forkRef(root, ref)}
      {...rest}
    >
      <div className={styles.frame}>
        <video
          ref={media}
          className={styles.media}
          src={src}
          poster={poster}
          autoPlay={autoPlay && !covered}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => setAt(event.currentTarget.currentTime)}
          onLoadedMetadata={onMetadata}
        >
          {captions !== undefined && (
            <track
              kind="captions"
              src={captions.src}
              srcLang={captions.lang}
              label={captions.label}
              default={captions.defaultOn}
            />
          )}
        </video>

        {!playing && !covered && (
          /* The picture is the target here; the control row below says the same
             thing in words, so this one is not said twice. */
          <button type="button" className={styles.start} onClick={toggle} aria-hidden="true" tabIndex={-1}>
            <span className={styles.startGlyph}>
              <PlayGlyph />
            </span>
          </button>
        )}

        {cover !== undefined && <div className={styles.cover}>{cover}</div>}
      </div>

      <div className={styles.controls}>
        <Button
          iconOnly
          aria-label={playing ? labels.pause : labels.play}
          variant="ghost"
          size="sm"
          onClick={toggle}
        >
          {playing ? <PauseGlyph /> : <PlayGlyph />}
        </Button>

        <input
          type="range"
          className={styles.scrub}
          aria-label={labels.seek}
          min={0}
          max={length || 0}
          step={1}
          value={Math.min(at, length || 0)}
          onChange={(event) => goTo(Number(event.target.value))}
        />

        <Text variant="meta" className={styles.time}>
          {`${clock(at)} / ${clock(length)}`}
        </Text>

        <Button
          iconOnly
          aria-label={muted ? labels.unmute : labels.mute}
          variant="ghost"
          size="sm"
          onClick={toggleSound}
        >
          {muted ? <VolumeOffGlyph /> : <VolumeGlyph />}
        </Button>

        {captions !== undefined && (
          <Button
            iconOnly
            aria-label={captionsLabel}
            variant="ghost"
            size="sm"
            aria-pressed={captions.defaultOn ?? false}
            onClick={toggleCaptions}
          >
            <CaptionsGlyph />
          </Button>
        )}

        <Button
          iconOnly
          aria-label={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <FullscreenExitGlyph /> : <FullscreenGlyph />}
        </Button>
      </div>

      {chapters !== undefined && chapters.length > 0 && (
        <ul className={styles.chapters} aria-label={chaptersLabel}>
          {chapters.map((chapter) => (
            <li key={chapter.at}>
              <Button variant="ghost" size="sm" className={styles.chapter} onClick={() => selectChapter(chapter)}>
                <Text variant="meta" className={styles.chapterAt}>
                  {clock(chapter.at)}
                </Text>
                <Text variant="body">{chapter.label}</Text>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
