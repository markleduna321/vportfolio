"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "./projects";
import styles from "./selected-work.module.css";

function toggleCaptions(video: HTMLVideoElement | null) {
  const track = video?.textTracks[0];
  if (track) track.mode = track.mode === "showing" ? "hidden" : "showing";
}

export default function ProjectVideo({
  project,
  preview = false,
}: {
  project: Project;
  preview?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const resumeRef = useRef(true);
  const autoPausedRef = useRef(false);
  const manualPlayRef = useRef(false);
  const start = project.previewStart ?? 0;
  const end = project.previewEnd ?? start + 8;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = false;
    let disposed = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (inView && !document.hidden) {
        setLoad(true);
        if (preference.matches && (preview || !manualPlayRef.current)) {
          autoPausedRef.current = true;
          video.pause();
        } else if (resumeRef.current && video.readyState >= 2) {
          autoPausedRef.current = false;
          void video.play().catch((cause: unknown) => {
            if (disposed || (cause instanceof DOMException && cause.name === "AbortError")) return;
            console.error(`Playback failed for "${project.title}":`, cause);
            setError(preview ? "Preview unavailable" : "Playback did not start. Use Play to start the film.");
          });
        }
      } else {
        autoPausedRef.current = true;
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 });
    observer.observe(video);
    video.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    const onPreferenceChange = () => {
      manualPlayRef.current = false;
      syncPlayback();
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      preference.removeEventListener("change", onPreferenceChange);
      video.pause();
    };
  }, [project.title, preview]);

  useEffect(() => {
    if (preview) return;
    const onFullscreen = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, [preview]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      resumeRef.current = false;
      video.pause();
      return;
    }
    manualPlayRef.current = true;
    resumeRef.current = true;
    try {
      await video.play();
    } catch (cause) {
      console.error(`Playback failed for "${project.title}":`, cause);
      setError("This film could not start. Try Play again or reload the page.");
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === playerRef.current) await document.exitFullscreen();
      else await playerRef.current?.requestFullscreen();
    } catch (cause) {
      console.error("The film could not enter fullscreen:", cause);
      setError("Fullscreen is unavailable in this browser. You can still watch the film here.");
    }
  }

  function formatTime(value: number) {
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  }

  function restartPreview() {
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration) && video.duration > start) {
      video.currentTime = start;
    }
  }

  function keepPreviewInRange() {
    const video = videoRef.current;
    if (preview && video && (video.currentTime >= end || video.currentTime < start)) {
      restartPreview();
    }
  }

  const media = (
    <>
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className={preview ? styles.previewVideo : styles.video}
        src={load ? project.src ?? undefined : undefined}
        poster={project.poster}
        muted
        playsInline
        loop={preview}
        controls={false}
        preload="metadata"
        aria-label={preview ? undefined : project.title}
        aria-hidden={preview || undefined}
        onLoadedMetadata={(event) => {
          if (preview) restartPreview();
          else setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
        }}
        onTimeUpdate={(event) => {
          if (preview) keepPreviewInRange();
          else setTime(event.currentTarget.currentTime);
        }}
        onSeeking={keepPreviewInRange}
        onEnded={() => {
          if (preview) restartPreview();
        }}
        onPlay={() => { resumeRef.current = true; setError(null); if (!preview) setPlaying(true); }}
        onPause={() => {
          if (!autoPausedRef.current && !preview) resumeRef.current = false;
          if (!preview) setPlaying(false);
        }}
        onVolumeChange={(event) => { if (!preview) setMuted(event.currentTarget.muted); }}
        onError={() => setError(preview ? "Preview unavailable" : "This film could not be loaded. Check the video file and reload to try again.")}
      >
        {!preview && project.captions && (
          <track kind="captions" src={project.captions} srcLang="en" label="English" default />
        )}
      </video>
      {error && (
        <span className={preview ? styles.previewError : styles.mediaError} role={preview ? undefined : "alert"}>
          {error}
        </span>
      )}
    </>
  );

  if (preview) return media;

  return (
    <div className={styles.playerMedia} ref={playerRef}>
      {media}
      <div className={styles.playerControls} aria-label="Film playback controls">
        <button type="button" onClick={() => void togglePlayback()} aria-label={playing ? "Pause film" : "Play film"}>
          {playing ? "PAUSE" : "PLAY"}
        </button>
        <span>{formatTime(time)} / {formatTime(duration)}</span>
        <input
          type="range"
          aria-label="Seek film"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          min={0}
          max={duration || 1}
          step={0.1}
          value={Math.min(time, duration)}
          disabled={!duration}
          onChange={(event) => {
            if (videoRef.current) videoRef.current.currentTime = Number(event.target.value);
          }}
        />
        <button type="button" aria-label={muted ? "Unmute film" : "Mute film"} onClick={() => {
          if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
        }}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
        {project.captions && (
          <button type="button" aria-label="Toggle English captions" onClick={() => toggleCaptions(videoRef.current)}>CC</button>
        )}
        <button type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          {fullscreen ? "EXIT" : "FULL"}
        </button>
      </div>
    </div>
  );
}
