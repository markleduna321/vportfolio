"use client";

import { useEffect, useState } from "react";
import styles from "./site-header.module.css";

const links = [
  { href: "#home", label: "Home" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#work", label: "Selected Work" },
  { href: "#approach", label: "Tech Stack & Workflow" },
  { href: "#contact", label: "Contact & Consultation" },
];

export default function SiteHeader({ revealClassName }: { revealClassName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const moved = window.scrollY > 16;
      setScrolled(moved);
      if (moved) setRevealed(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(min-width: 1101px)");
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${revealClassName} ${revealed ? styles.revealed : ""} ${scrolled ? styles.scrolled : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
    >
      <a className={styles.wordmark} href="#home" aria-label="Mark Harvey Leduna, home" onClick={() => setMenuOpen(false)}>
        Mark Harvey <span>Leduna</span>
      </a>
      <button className={styles.menuToggle} type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => {
        setRevealed(true);
        setMenuOpen((open) => !open);
      }}>
        {menuOpen ? "CLOSE" : "MENU"} <span aria-hidden="true">{menuOpen ? "\u2212" : "+"}</span>
      </button>
      <nav id="main-navigation" className={styles.nav} data-open={menuOpen} aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
      </nav>
    </header>
  );
}
