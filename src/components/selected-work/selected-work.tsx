"use client";

import { useRef, useState } from "react";
import { projects, type Project } from "./projects";
import VintageReel from "./vintage-reel";
import ProjectVideo from "./project-video";
import TVWall from "./tv-wall";
import styles from "./selected-work.module.css";

export default function SelectedWork() {
  const [selected, setSelected] = useState(projects[0]);
  const [playbackId, setPlaybackId] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  function selectProject(project: Project) {
    setSelected(project);
    setPlaybackId((id) => id + 1);
    if (window.matchMedia("(max-width: 760px)").matches) {
      playerRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }

  return (
    <div className={styles.work} id="work">
      <section className={styles.reelSection} aria-labelledby="reel-heading">
        <VintageReel />
      </section>

      <section
        className={styles.showcaseSection}
        id="project-showcase"
        aria-labelledby="showcase-heading"
      >
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>02 / B — PROJECT SHOWCASE</p>
          <span className={styles.micro}>LOOK CLOSER. THERE&apos;S A STORY HERE.</span>
        </div>
        <div className={styles.showcaseIntro}>
          <h2 id="showcase-heading">
            Every frame, <em>considered.</em>
          </h2>
          <p>Eight screens. Eight stories.<br />Choose a television. Watch the full cut.</p>
        </div>

        <div className={styles.showcaseGrid}>
          <div className={styles.playerPanel} id="project-player" ref={playerRef}>
            <div className={styles.playerToolbar}>
              <span><i aria-hidden="true" /> THE VIEWING ROOM</span>
              <span>{selected.number} / {String(projects.length).padStart(2, "0")}</span>
            </div>
            <div className={styles.modernScreen}>
              {selected.src ? (
                <ProjectVideo
                  key={`${selected.id}-${selected.src}-${playbackId}`}
                  project={selected}
                />
              ) : (
                <div className={styles.projectPlaceholder}>
                  <span className={styles.placeholderFrame} aria-hidden="true">
                    {selected.number}
                  </span>
                  <span className={styles.micro}>{selected.category}</span>
                  <h3>{selected.title}</h3>
                  <p>Project film coming soon</p>
                  <span className={styles.previewLabel}>PREVIEW PLACEHOLDER</span>
                </div>
              )}
            </div>
            <div className={styles.playerDetails} aria-live="polite" aria-atomic="true">
              <span className={styles.micro}>
                {selected.src ? "SELECTED FILM" : "PLACEHOLDER PROJECT"} / {selected.category}
              </span>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              {selected.tags.length > 0 && (
                <ul className={styles.tags} aria-label="Project specializations">
                  {selected.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              )}
            </div>
            <p className={styles.playerNote}>
              {selected.src
                ? "Playback starts muted. Use the player controls for sound and fullscreen."
                : "Your project video will play here once its media file is added."}
            </p>
          </div>

          <div className={styles.projectList} aria-label="Select a project television">
            <div className={styles.listHeader}>
              <h3>THE SIGNAL WALL</h3>
              <span>{String(projects.length).padStart(2, "0")} LIVE PREVIEWS</span>
            </div>
            <TVWall selectedId={selected.id} onSelect={selectProject} />
            <p className={styles.indexNote}>
              A wall of moving moments. Each screen loops a short scene;
              select one to experience the complete film.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
