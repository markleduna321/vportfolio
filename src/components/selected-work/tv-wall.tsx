"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "./projects";
import ProjectVideo from "./project-video";
import styles from "./selected-work.module.css";

type Wall = ReturnType<typeof import("./tv-wall-scene").createTVWall>;

export default function TVWall({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (project: Project) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Wall | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    if (!root || !host) return;
    let disposed = false;
    function onContextLost(event: Event) {
      event.preventDefault();
      console.error("The 3D TV wall lost its WebGL context.");
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setError("The 3D display was interrupted. The standard previews are still available.");
      setReady(false);
    }
    host.addEventListener("webglcontextlost", onContextLost, true);
    void import("./tv-wall-scene").then(({ createTVWall }) => {
      if (disposed) return;
      sceneRef.current = createTVWall(host, root);
      setReady(true);
    }).catch((cause: unknown) => {
      if (disposed) return;
      console.error("The 3D TV wall could not initialize:", cause);
      setError("3D is unavailable in this browser. Choose a standard preview below to watch a film.");
    });
    return () => {
      disposed = true;
      host.removeEventListener("webglcontextlost", onContextLost, true);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.resize();
    sceneRef.current?.setSelected(selectedId);
  }, [selectedId, ready]);

  return (
    <>
      <div className={styles.tvWall} ref={rootRef} data-rendered={ready && !error}>
        {projects.map((project, index) => (
          <button
            className={styles.tvButton}
            type="button"
            key={project.id}
            data-model={index % 3}
            data-project-id={project.id}
            aria-pressed={project.id === selectedId}
            aria-controls="project-player"
            aria-label={`Play ${project.title}`}
            onClick={() => onSelect(project)}
          >
            <span className={styles.tvCabinet} data-tv-cabinet>
              <span className={styles.tvScreen}>
                {project.src ? <ProjectVideo project={project} preview /> : (
                  <span className={styles.previewError}>Film coming soon</span>
                )}
                <span className={styles.screenGlass} aria-hidden="true" />
              </span>
              <span className={styles.tvHardware} aria-hidden="true">
                <span className={styles.tvDial} />
                <span className={styles.tvDial} />
                <span className={styles.tvSpeaker} />
                <span className={styles.tvPower} />
              </span>
            </span>
            <span className={styles.tvLabel}>
              <span className={styles.projectNumber}>{project.number}</span>
              <span className={styles.projectTitle}>{project.title}</span>
              <span className={styles.selectionMark} aria-hidden="true">{project.id === selectedId ? "\u2197" : "+"}</span>
            </span>
          </button>
        ))}
        <div className={styles.wallCanvas} ref={hostRef} aria-hidden="true" />
      </div>
      {!ready && !error && <p className={styles.wallStatus} role="status">Lighting the signal wall...</p>}
      {error && <p className={styles.wallStatus} role="status">{error}</p>}
    </>
  );
}
