import styles from "./page.module.css";
import SelectedWork from "@/components/selected-work/selected-work";
import Image from "next/image";
import ContactSection from "@/components/contact/contact-section";
import SiteHeader from "@/components/site-header/site-header";

const toolMarks: Record<string, { src: string } | { initials: string }> = {
  Gemini: { src: "/images/tools/gemini.svg" },
  Claude: { src: "/images/tools/claude.svg" },
  Higgsfield: { initials: "H" },
  "Google Flow": { initials: "GF" },
  Photoshop: { src: "/images/tools/photoshop.svg" },
  "Premiere Pro": { src: "/images/tools/premiere-pro.svg" },
  "After Effects": { src: "/images/tools/after-effects.svg" },
  CapCut: { src: "/images/tools/capcut.svg" },
};

const capabilities = [
  {
    number: "01",
    category: "GENERATIVE DIRECTION",
    title: "Prompt-to-video generation",
    description:
      "Turn a creative brief into moving images, with thoughtful direction for every shot, movement, and composition.",
    tags: ["Prompt engineering", "Shot iteration", "Visual continuity"],
  },
  {
    number: "02",
    category: "LANGUAGE & LOCALIZATION",
    title: "AI-assisted video translation",
    description:
      "Adapt dialogue for new audiences while preserving the timing, meaning, and intent of the original story.",
    tags: ["Transcription", "Translation review", "Dialogue alignment"],
  },
  {
    number: "03",
    category: "CAPTIONS & ACCESSIBILITY",
    title: "Automated SRT subtitle formatting",
    description:
      "Turn transcripts into clean, synchronized subtitle files, checked for readability and ready to deliver.",
    tags: ["Timecode validation", "Cue formatting", "Readability checks"],
  },
  {
    number: "04",
    category: "WORKFLOW ENGINEERING",
    title: "Custom processing pipelines",
    description:
      "Build considered workflows that simplify repetitive production steps and keep every deliverable consistent.",
    tags: ["Batch processing", "Task automation", "Export validation"],
  },
];

const toolGroups = [
  {
    number: "01",
    category: "AI & GENERATIVE PRODUCTION",
    title: "Explore what could be.",
    description: "From an idea to a usable shot. AI supports the process; creative direction stays human.",
    tools: [
      { name: "Gemini", role: "Research & prompt development", detail: "Explore briefs and refine a shot's visual direction." },
      { name: "Claude", role: "Scripts & workflow logic", detail: "Refine scripts, processing logic, and structured subtitle workflows." },
      { name: "Higgsfield", role: "AI visuals & motion", detail: "Explore generated shots, camera movement, and visual treatments." },
      { name: "Google Flow", role: "AI scene development", detail: "Iterate on generated scenes using prompts and visual references." },
    ],
  },
  {
    number: "02",
    category: "EDITING & FINISHING",
    title: "Make every frame count.",
    description: "Generation is only the beginning. The story comes together through deliberate editing and finishing.",
    tools: [
      { name: "Photoshop", role: "Images & visual assets", detail: "Prepare references, layered artwork, and thumbnails." },
      { name: "Premiere Pro", role: "Editorial, pacing & sound", detail: "Shape the cut, refine rhythm, and balance dialogue and music." },
      { name: "After Effects", role: "Motion & compositing", detail: "Animate titles, composite layers, and polish visual effects." },
      { name: "CapCut", role: "Social & platform cuts", detail: "Adapt short-form edits, captions, and screen formats." },
    ],
  },
];

const steps = [
  {
    number: "01", title: "Define the direction",
    description: "Align on the audience, message, visual references, and delivery formats. Develop a script and shot plan before generating footage.",
    output: "Brief / script / shot plan",
  },
  {
    number: "02", title: "Generate & iterate",
    description: "Prepare reference assets and refine prompts, framing, and movement. Compare takes for visual consistency and select footage that serves the story.",
    output: "References / prompts / selected takes",
  },
  {
    number: "03", title: "Edit & finish",
    description: "Build the sequence, refine pacing, composite graphics, and shape sound. Review translated dialogue and subtitle timing where the project needs them.",
    output: "Picture / motion / sound / captions",
  },
  {
    number: "04", title: "Review & deliver",
    description: "Check continuity, caption readability, audio, and export settings. Incorporate feedback and prepare the final master plus platform-specific versions.",
    output: "Reviewed master / platform exports",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader revealClassName={styles.delayedReveal} />

      <main>
        <section className={styles.hero} id="home">
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="https://vsseqqcyieltucqr.public.blob.vercel-storage.com/hero.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={`${styles.heroContent} ${styles.delayedReveal}`}>
            <p className={styles.eyebrow}>
              INDEPENDENT VIDEO EDITOR &amp; VISUAL STORYTELLER
              <span className={styles.availability}>
                <span aria-hidden="true" /> AVAILABLE FOR SELECT PROJECTS
              </span>
            </p>
            <h1>
              Mark Harvey
              <br />
              <span className={styles.heroAccent}>Leduna</span>
            </h1>
            <div className={styles.heroBottom}>
              <p>
                Cinematic edits and visual stories, shaped to make every frame
                mean something.
              </p>
              <a className={styles.textLink} href="#work">
                EXPLORE MY WORK <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className={`${styles.capabilities} ${styles.section}`}
          id="capabilities"
          aria-labelledby="capabilities-heading"
        >
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>01 — CAPABILITIES &amp; SPECIALIZATIONS</p>
            <h2 id="capabilities-heading">
              Creative instinct.
              <br />
              <span>Technical precision.</span>
            </h2>
            <p className={styles.sectionDescription}>
              A balance of storytelling, emerging tools, and meticulous craft.
              From the first idea to the final frame.
            </p>
          </div>
          <div className={styles.capabilityList}>
            {capabilities.map((item) => (
              <article className={styles.capability} key={item.number}>
                <span className={styles.itemNumber}>{item.number}</span>
                <div className={styles.capabilityBody}>
                  <p className={styles.capabilityCategory}>{item.category}</p>
                  <h3>{item.title}</h3>
                  <p className={styles.capabilityDescription}>{item.description}</p>
                  <ul className={styles.tagList} aria-label={`${item.title} specializations`}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SelectedWork />

        <section className={`${styles.approach} ${styles.section}`} id="approach" aria-labelledby="workflow-heading">
          <div className={styles.approachTop}>
            <div>
              <p className={styles.sectionLabel}>03 — TECH STACK &amp; WORKFLOW</p>
              <h2 id="workflow-heading">
                AI expands the possible.
                <br />
                <span>Craft makes it matter.</span>
              </h2>
            </div>
            <p className={styles.sectionDescription}>
              More than a prompt and an export. I connect generative tools with
              established editing software to build stories with intention,
              consistency, and a clear path to delivery.
            </p>
          </div>
          <div className={styles.toolArea}>
            {toolGroups.map((group) => (
              <article className={styles.toolGroup} key={group.number}>
                <div className={styles.toolGroupHeader}>
                  <span>{group.number}</span>
                  <p>{group.category}</p>
                </div>
                <h3>{group.title}</h3>
                <p className={styles.toolGroupDescription}>{group.description}</p>
                <ul className={styles.toolList} aria-label={group.category}>
                  {group.tools.map((tool) => {
                    const mark = toolMarks[tool.name];
                    return (
                      <li key={tool.name}>
                        <div className={styles.toolIdentity}>
                          <span className={styles.toolLogo} aria-hidden="true">
                            {"src" in mark ? (
                              <Image src={mark.src} alt="" width={30} height={30} />
                            ) : (
                              <span className={styles.toolInitials}>{mark.initials}</span>
                            )}
                          </span>
                          <h4>{tool.name}</h4>
                        </div>
                        <div>
                          <p className={styles.toolRole}>{tool.role}</p>
                          <p className={styles.toolDetail}>{tool.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
          <div className={styles.workflow}>
            <div className={styles.workflowHeader}>
              <p className={styles.smallLabel}>THE WORKFLOW / FROM BRIEF TO FINAL FRAME</p>
              <span>HUMAN DIRECTION AT EVERY STAGE</span>
            </div>
            <div className={styles.steps}>
              {steps.map((step) => (
                <article className={styles.step} key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <p className={styles.stepOutput}>{step.output}</p>
                </article>
              ))}
            </div>
          </div>
          <p className={styles.workflowNote}>
            <span aria-hidden="true" />
            The tools change with the brief. The standard stays the same:
            a considered edit, checked by a human.
          </p>
        </section>

        <ContactSection />
      </main>
    </>
  );
}
