import { projects } from "./projects";
import ShowcaseVideo from "./showcase-video";
import styles from "./showcase.module.css";

export default function SelectedWork() {
  return (
    <div className={styles.work} id="work">
      <section
        className={styles.showcaseSection}
        id="project-showcase"
        aria-labelledby="showcase-heading"
      >
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>02 — PROJECT SHOWCASE</p>
          <span className={styles.filmCount}>
            {String(projects.length).padStart(2, "0")} FILMS
          </span>
        </div>
        <div className={styles.showcaseIntro}>
          <h2 id="showcase-heading">
            Stories in <em>motion.</em>
          </h2>
          <p>A selection of films, made to be seen in full.</p>
        </div>

        <div className={styles.gallery} data-project-gallery>
          {projects.map((project, index) => (
            <article className={styles.film} key={project.id}>
              <ShowcaseVideo project={project} />
              <div className={styles.filmCaption}>
                <span>{String(index + 1).padStart(2, "0")} /</span>
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
