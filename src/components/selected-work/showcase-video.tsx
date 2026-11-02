"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "./projects";
import styles from "./showcase.module.css";

export default function ShowcaseVideo({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.1) video.pause();
    }, { threshold: 0.1 });
    const pauseWhenHidden = () => {
      if (document.hidden) video.pause();
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
    };
  }, [project.src]);

  if (!project.src) {
    return (
      <div className={`${styles.placeholder} ${styles[project.orientation]}`}>
        <span>Film coming soon</span>
      </div>
    );
  }

  return (
    <div className={`${styles.media} ${styles[project.orientation]}`}>
      <video
        ref={videoRef}
        className={styles.video}
        src={project.src}
        poster={project.poster}
        controls
        playsInline
        preload="none"
        crossOrigin={project.captions ? "anonymous" : undefined}
        aria-label={`${project.title}: full video`}
        onPlay={(event) => {
          const current = event.currentTarget;
          current.closest("[data-project-gallery]")?.querySelectorAll("video").forEach((video) => {
            if (video !== current) video.pause();
          });
          setHasError(false);
        }}
        onError={() => setHasError(true)}
      >
        {project.captions && (
          <track kind="captions" src={project.captions} srcLang="en" label="English" default />
        )}
        Your browser does not support video playback.{" "}
        <a href={project.src}>Open the video</a>.
      </video>
      {hasError && (
        <p className={styles.mediaError} role="alert">
          This film could not be loaded.{" "}
          <a href={project.src} target="_blank" rel="noopener noreferrer">Open the video</a>.
        </p>
      )}
    </div>
  );
}
