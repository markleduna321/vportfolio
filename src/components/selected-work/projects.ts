export type Project = {
  id: string;
  title: string;
  src: string | null;
  orientation: "landscape" | "portrait";
  poster?: string;
  captions?: string;
};

const videoBaseUrl = "https://vsseqqcyieltucqr.public.blob.vercel-storage.com";

export const projects: Project[] = [
  {
    id: "logo-reveal",
    title: "ASURATECH / Logo reveal",
    src: `${videoBaseUrl}/Logo_reveal_for_ASURATECH_SOLUTIONS_202608252019.mp4`,
    orientation: "landscape",
    poster: "/images/showcase/logo-reveal.webp",
  },
  {
    id: "asuratech",
    title: "ASURATECH",
    src: `${videoBaseUrl}/AsuraTECH.mp4`,
    orientation: "portrait",
    poster: "/images/showcase/asuratech.webp",
  },
  {
    id: "github",
    title: "GitHub",
    src: `${videoBaseUrl}/GitHub.mp4`,
    orientation: "landscape",
    poster: "/images/showcase/github.webp",
  },
  {
    id: "gym-asura",
    title: "Gym Asura",
    src: `${videoBaseUrl}/gymasura.mp4`,
    orientation: "portrait",
    poster: "/images/showcase/gym-asura.webp",
  },
  {
    id: "lighthouse",
    title: "Lighthouse",
    src: `${videoBaseUrl}/Lighthouse.mp4`,
    orientation: "portrait",
    poster: "/images/showcase/lighthouse.webp",
  },
  {
    id: "uiux",
    title: "UI / UX",
    src: `${videoBaseUrl}/UIUX.mp4`,
    orientation: "portrait",
    poster: "/images/showcase/uiux.webp",
  },
  {
    id: "1013",
    title: "1013",
    src: `${videoBaseUrl}/1013.mp4`,
    orientation: "portrait",
    poster: "/images/showcase/1013.webp",
  },
  {
    id: "hero",
    title: "Hero",
    src: `${videoBaseUrl}/hero.mp4`,
    orientation: "landscape",
    poster: "/images/showcase/hero.webp",
  },
];
