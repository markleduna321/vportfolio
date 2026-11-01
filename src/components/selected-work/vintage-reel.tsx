"use client";

import { useEffect, useRef, useState } from "react";
import { reelClips } from "./projects";
import styles from "./vintage-reel.module.css";

const CLIP_PREVIEW_SECONDS = 8;
const EVOLUTION_SECONDS = 36;
const CAMERA_ANGLES = ["The family room", "Over the shoulder", "Inside the story"];
const CHAPTERS = [
  {
    era: "01 / THE ANALOG YEARS",
    title: "It started with a shared screen.",
    text: "Long before the endless scroll, moving images brought us together. Advertisements, films, and television shows became part of everyday life.",
  },
  {
    era: "02 / THE CONNECTED WORLD",
    title: "The screen changed. The connection stayed.",
    text: "From the living room to the screen in our hands, video carried our stories further. New tools gave more people a voice, and more ideas a place to be seen.",
  },
  {
    era: "03 / NOW, AND WHAT COMES NEXT",
    title: "We evolve. Our stories evolve with us.",
    text: "Today, editing, AI, and new creative technologies expand what we can imagine. From advertisements to shows and beyond, video keeps evolving alongside humanity.",
  },
];

type Room = ReturnType<typeof import("./vintage-room").createVintageRoom>;

export default function VintageReel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const activeRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const advancingRef = useRef(false);
  const [clipIndex, setClipIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);
  const [sceneError, setSceneError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const clip = reelClips[clipIndex];
  const progress = Math.min(elapsed / EVOLUTION_SECONDS, 1);
  const chapterIndex = Math.min(Math.floor(elapsed / 12), 2);
  const chapter = CHAPTERS[chapterIndex];
  const typedText = chapter.text.slice(
    0, Math.floor(Math.max(0, elapsed - chapterIndex * 12) * 28),
  );

  async function play() {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setMediaError(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Showreel playback failed:", error);
      setMediaError("Automatic playback was blocked. Use Retry video to start the reel.");
    }
  }

  function nextClip() {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setClipIndex((index) => (index + 1) % reelClips.length);
  }

  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    if (!host || !video) return;
    let disposed = false;
    let inView = false;
    let clock = 0;
    let lastTick = performance.now();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = preference.matches;

    function syncActivity() {
      activeRef.current = inView && !document.hidden;
      roomRef.current?.setActive(activeRef.current);
      if (activeRef.current && !reducedMotionRef.current) void play();
      else video?.pause();
    }
    function onPreferenceChange() {
      reducedMotionRef.current = preference.matches;
      roomRef.current?.setReducedMotion(preference.matches);
      if (preference.matches) {
        clock = EVOLUTION_SECONDS;
        setElapsed(clock);
        roomRef.current?.setEvolution(1);
      }
      syncActivity();
    }
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncActivity();
    }, { threshold: 0.15 });
    visibility.observe(host);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - lastTick) / 1000, 0.2);
      lastTick = now;
      if (!activeRef.current || !roomRef.current || reducedMotionRef.current || clock >= EVOLUTION_SECONDS) return;
      clock = Math.min(clock + delta, EVOLUTION_SECONDS);
      setElapsed(clock);
      roomRef.current.setEvolution(clock / EVOLUTION_SECONDS);
    }, 50);
    function onContextLost(event: Event) {
      event.preventDefault();
      roomRef.current?.setActive(false);
      setSceneError("The 3D display was interrupted. Your reel is available in the standard player.");
    }
    host.addEventListener("webglcontextlost", onContextLost, true);
    document.addEventListener("visibilitychange", syncActivity);
    preference.addEventListener("change", onPreferenceChange);
    void import("./vintage-room")
      .then(({ createVintageRoom }) => {
        if (disposed) return;
        roomRef.current = createVintageRoom(host, video);
        onPreferenceChange();
        setReady(true);
      })
      .catch((error: unknown) => {
        if (disposed) return;
        console.error("3D room failed to initialize:", error);
        clock = EVOLUTION_SECONDS;
        setElapsed(clock);
        setSceneError("Your browser could not open the 3D room. Enjoy the reel in the standard player instead.");
      });
    return () => {
      disposed = true;
      window.clearInterval(timer);
      visibility.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", syncActivity);
      host.removeEventListener("webglcontextlost", onContextLost, true);
      video.pause();
      roomRef.current?.dispose();
      roomRef.current = null;
    };
  }, []);

  return (
    <figure className={styles.reel} data-era={chapterIndex} data-camera={angle}>
      <div className={styles.scene} ref={hostRef} aria-hidden="true" />
      <div
        className={styles.filmTreatment}
        style={{ opacity: 1 - progress * 0.8 }}
        aria-hidden="true"
      />
      <div className={styles.readabilityShade} aria-hidden="true" />
      <header className={styles.intro}>
        <p className={styles.eyebrow}>02 / A — SELECTED WORK / A STORY THROUGH TIME</p>
        <h2 id="reel-heading">A changing world.<br /><em>A timeless connection.</em></h2>
      </header>
      {!ready && !sceneError && (
        <p className={styles.loading} role="status">SETTING THE SCENE...</p>
      )}
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className={sceneError ? styles.fallbackVideo : styles.textureVideo}
        src={clip.src}
        muted
        playsInline
        controls={Boolean(sceneError)}
        preload="metadata"
        aria-label={`Showreel: ${clip.title}`}
        aria-hidden={!sceneError}
        onLoadedMetadata={() => { advancingRef.current = false; }}
        onCanPlay={() => {
          if (activeRef.current && !reducedMotionRef.current) void play();
        }}
        onTimeUpdate={(event) => {
          if (event.currentTarget.currentTime >= CLIP_PREVIEW_SECONDS) nextClip();
        }}
        onEnded={nextClip}
        onError={() => {
          advancingRef.current = false;
          setMediaError(`"${clip.title}" could not be loaded. Use Skip unavailable clip to continue.`);
        }}
      />
      {sceneError && <p className={styles.sceneError} role="alert">{sceneError}</p>}
      <figcaption className={styles.story}>
        <div className={styles.timeline} aria-hidden="true">
          <span>ANALOG</span>
          <span className={styles.timelineTrack}><span style={{ width: `${progress * 100}%` }} /></span>
          <span>WHAT&apos;S NEXT</span>
        </div>
        <p className={styles.eyebrow}>{chapter.era}</p>
        <h3>{chapter.title}</h3>
        <p className={styles.typewriter} aria-label={chapter.text}>
          <span aria-hidden="true">{typedText}<span className={styles.cursor}>|</span></span>
        </p>
      </figcaption>
      <div className={styles.controls}>
        <button
          type="button"
          disabled={!ready || Boolean(sceneError)}
          onClick={() => {
            const next = (angle + 1) % CAMERA_ANGLES.length;
            roomRef.current?.setCameraAngle(next);
            setAngle(next);
          }}
          aria-label={`Change camera angle. Current view: ${CAMERA_ANGLES[angle]}`}
        >
          CHANGE CAMERA <span aria-hidden="true">↗</span>
          <small>{String(angle + 1).padStart(2, "0")} / {CAMERA_ANGLES[angle]}</small>
        </button>
        <a href="#project-showcase">EXPLORE THE FULL CUTS <span aria-hidden="true">↓</span></a>
      </div>
      {mediaError && (
        <div className={styles.playbackError} role="alert">
          <p>{mediaError}</p>
          <button type="button" onClick={() => void play()}>Retry video</button>
          <button type="button" onClick={() => { setMediaError(null); nextClip(); }}>Skip unavailable clip</button>
        </div>
      )}
    </figure>
  );
}
