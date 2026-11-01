export type Project = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  src: string | null;
  poster?: string;
  captions?: string;
  previewStart?: number;
  previewEnd?: number;
};

export const reelClips = [
  { title: "ASURATECH / Logo reveal", src: "/videos/showcase/Logo_reveal_for_ASURATECH_SOLUTIONS_202608252019.mp4" },
  { title: "ASURATECH", src: "/videos/showcase/AsuraTECH.mp4" },
  { title: "GitHub", src: "/videos/showcase/GitHub.mp4" },
  { title: "Gym Asura", src: "/videos/showcase/gymasura.mp4" },
  { title: "Lighthouse", src: "/videos/showcase/Lighthouse.mp4" },
  { title: "UI / UX", src: "/videos/showcase/UIUX.mp4" },
  { title: "1013", src: "/videos/showcase/1013.mp4" },
  { title: "Hero", src: "/videos/showcase/hero.mp4" },
];

export const projects: Project[] = reelClips.map((clip, index) => ({
  id: `film-${index + 1}`,
  number: String(index + 1).padStart(2, "0"),
  category: "FROM THE EDIT ROOM",
  title: clip.title,
  description:
    "A film from the selected-work collection. Explore the full cut here, or tune into another screen to discover the next story.",
  tags: [],
  src: clip.src,
  previewStart: 0,
  previewEnd: 8,
}));
