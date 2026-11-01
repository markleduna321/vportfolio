"use client";

import { useState, type FormEvent } from "react";
import styles from "./contact-section.module.css";

const EMAIL = "markharvey.leduna@gmail.com";

export default function ContactSection() {
  const [draft, setDraft] = useState<string | null>(null);

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const timeline = String(data.get("timeline") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message) {
      setDraft(null);
      const field = event.currentTarget.elements.namedItem(!name ? "name" : "message");
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity("Please include more than spaces.");
        field.reportValidity();
      }
      return;
    }
    const body = [
      "Hello Mark,",
      "",
      "I'd like to discuss a project.",
      "",
      `Name: ${name}`,
      `Reply email: ${email}`,
      `Service: ${service}`,
      `Timeline: ${timeline || "To be discussed"}`,
      "",
      "Project brief:",
      message,
    ].join("\n");
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Project discussion / ${service}`)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }

  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <p className={styles.eyebrow}>04 / CONTACT &amp; CONSULTATION</p>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.kicker}>YOUR NEXT STORY STARTS HERE</p>
          <h2 id="contact-heading">Let&apos;s make<br />something<br /><em>worth watching.</em></h2>
          <p className={styles.description}>
            An idea, a rough cut, or a brief ready to go. Tell me what you have
            in mind, and let&apos;s discuss how editing and AI-assisted production
            can bring it to life.
          </p>
          <div className={styles.consultation}>
            <span aria-hidden="true">01 /</span>
            <div>
              <h3>A project discussion</h3>
              <p>We&apos;ll start with your goals, explore the creative direction,
                and discuss the scope, timeline, and deliverables.</p>
            </div>
          </div>
          <a className={styles.email} href={`mailto:${EMAIL}`}>
            <span>PREFER A DIRECT EMAIL?</span>
            {EMAIL}
          </a>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <h3>Tell me about your project.</h3>
            <span>THE CREATIVE BRIEF</span>
          </div>
          <form onSubmit={prepareDraft} onInput={(event) => {
            setDraft(null);
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
              event.target.setCustomValidity("");
            }
          }}>
            <div className={styles.fields}>
              <label>Your name <span>*</span>
                <input name="name" autoComplete="name" required maxLength={100} placeholder="How should I address you?" />
              </label>
              <label>Email address <span>*</span>
                <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
              </label>
              <label>What do you need? <span>*</span>
                <select name="service" required defaultValue="">
                  <option value="" disabled>Select a service</option>
                  <option>Video editing &amp; finishing</option>
                  <option>AI video generation</option>
                  <option>Translation &amp; subtitles</option>
                  <option>Custom processing workflow</option>
                  <option>A mix / let&apos;s discuss</option>
                </select>
              </label>
              <label>Ideal timeline <small>OPTIONAL</small>
                <input name="timeline" maxLength={100} placeholder="A date, or still exploring" />
              </label>
            </div>
            <label className={styles.message}>Your project brief <span>*</span>
              <textarea name="message" required maxLength={1500} rows={5} placeholder="What are we creating? Share the audience, style, deliverables, and any references." />
            </label>
            <p className={styles.note}>
              Required fields are marked *. This form opens a draft in your email
              app. Review it and press Send there; nothing is sent or stored by this site.
            </p>
            <button className={styles.submit} type="submit">PREPARE PROJECT EMAIL <span aria-hidden="true">↗</span></button>
            {draft && (
              <div className={styles.draftStatus} role="status">
                <p>Your email draft is ready. If your email app opened, review the brief and send it there.
                  Your message has not been sent by this site.</p>
                <a href={draft}>Open the draft again</a>
                <p>No email app configured? Copy your brief and email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.</p>
              </div>
            )}
          </form>
        </div>
      </div>
      <footer className={styles.footer}>
        <span>MARK HARVEY LEDUNA / VIDEO &amp; VISUAL STORIES</span>
        <a href="https://asuratectsolutions.com" target="_blank" rel="noopener noreferrer">
          Powered by asuraTECH Solutions <span aria-hidden="true">↗</span>
        </a>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </section>
  );
}
