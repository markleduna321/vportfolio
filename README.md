# Portfolio

A single-page portfolio built with Next.js App Router, TypeScript, and CSS
Modules. The page uses anchor links for navigation and smooth scrolling between
sections.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project structure

```text
src/
  app/
    globals.css       Global styles, accessibility defaults, and smooth scrolling
    layout.tsx        Root layout and page metadata
    page.tsx          Portfolio sections and editable content
    page.module.css   Page-specific responsive styles
  components/
    contact/
      contact-section.tsx        Project discussion form and email draft
      contact-section.module.css Contact layout and form styling
    selected-work/
      projects.ts                Project video and poster configuration
      selected-work.tsx          Full-film showcase
      showcase-video.tsx         Native playback and media error handling
      showcase.module.css        Responsive showcase styles
```

The portfolio sections are defined in `src/app/page.tsx`: hero, capabilities
and specializations, project showcase, tools and workflow, and contact.
The capability, tool, and workflow content is kept in small arrays at
the top of that file so it is easy to edit section by section.

The capabilities section covers prompt-to-video generation, AI-assisted video
translation, automated SRT subtitle formatting, and custom processing pipelines.
Each entry includes a short description and its technical focus areas.

The Tech Stack & Workflow section pairs Gemini, Claude, Higgsfield, and Google
Flow with Photoshop, Premiere Pro, After Effects, and CapCut. Tools are grouped
by generative production and editing/finishing, with a practical role for each.
Its four-stage workflow covers direction, generation and iteration, editing,
and reviewed delivery. Edit `toolGroups` and `steps` in `src/app/page.tsx` to
adjust the toolkit, descriptions, and deliverables. This section is static,
uses the same dark moss/lime visual theme, and does not connect to AI services.
The two toolkit groups sit side by side on desktop and stack on phones.
Tool marks are local assets under `public/images/tools/`:
Gemini, Claude, and the Adobe app logos come from
[SVG Logos](https://github.com/gilbarbara/logos) (CC0), and CapCut from
[Lobe Icons](https://github.com/lobehub/lobe-icons) (MIT; license included alongside
the asset). Brand marks belong to their respective owners and do not imply
endorsement. Higgsfield and Google Flow use temporary initial badges as agreed;
replace their entries in `toolMarks` with local logo paths when assets are available.

## Project showcase

The showcase displays all eight full-length films directly in a responsive
gallery. Portrait and landscape videos keep their original framing, and each
has native playback, sound, seeking, and fullscreen controls. Films do not
autoplay and use `preload="none"` to defer media requests. Starting one pauses
the others, and playback pauses when less than 10% of the film is visible or
the browser tab is hidden. A failed video shows an explicit message and a link
to the source.

Edit `src/components/selected-work/projects.ts` to add or change a film:

- Give each entry a unique `id`, a `title`, and a public MP4 `src`. A `null`
  source displays a coming-soon placeholder.
- Set `orientation` to `portrait` or `landscape` to reserve the correct
  aspect ratio before playback.
- Set `poster` to a representative still. The existing optimized frames live
  in `public/images/showcase/`; replace the poster when replacing a video.
- Optionally set `captions` to an English WebVTT file. Convert SRT files to
  WebVTT for browser playback.

Use web-optimized videos or a video CDN for production: several supplied files
are larger than 100 MB.

The fixed navbar lives in `src/components/site-header/`. It shares the hero's
3.5-second reveal, remains transparent at the top, and adds a moss background
after 16px of scrolling. Scrolling also makes navigation immediately available
if the initial reveal has not finished, and opening the mobile menu keeps its
dropdown visible at the top of the page. All five links match the page sections;
smaller screens use an accessible toggle menu. Anchor scroll padding keeps
section headings below the navbar. The name and page metadata use Mark Harvey
Leduna. The footer credit links to `https://asuratectsolutions.com` as supplied.

## Contact & Consultation

The contact section lives in `src/components/contact/contact-section.tsx`, with
its own CSS Module. The project-discussion form collects a name, reply email,
service, optional timeline, and project brief. Native validation checks required
fields and email format; whitespace-only names/briefs receive an explicit error.
Submitting prepares an encoded `mailto:` draft addressed to
`markharvey.leduna@gmail.com`. Visitors must review and send it from their email
app. There is no backend, email service, automatic delivery, or site-side storage.
A draft link and direct email address remain available if the email app does
not open. Edit the `EMAIL` constant to change the recipient.

## Scripts

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint
- `npm run build` — export the production site into `out/`
- `npm run start` — Next.js server command; not used with the static export

## Deploying to cPanel / static hosting

The project uses Next.js static export. `npm run build` generates the real
homepage entry file at `out/index.html`, together with scripts, styles, logos,
any locally supplied videos, and a branded 1200 x 630 PNG at
`out/share-preview.png`.
Do not create a separate `public/index.html`: it would duplicate the Next.js
homepage rather than export the application.

1. Once you choose a domain, copy `.env.example` to `.env.local` and replace
   `SITE_URL` with the final HTTPS origin, for example `https://your-domain.com`.
   This site is configured to be hosted at the domain root, not a subfolder.
2. Run `npm run lint` and `npm run build`.
3. Upload the **contents** of `out/` into the domain's cPanel document root
   (usually `public_html`), including `_next/` and `images/`, and `videos/` if
   self-hosting the films. Keep all exported paths intact. No Node.js server is
   required.
4. Confirm that `/`, `/share-preview.png`, and the video URLs load publicly
   over HTTPS. The server must support byte-range requests for video seeking.

The page includes Open Graph and Twitter sharing metadata. The PNG is generated
at build time, so previews do not depend on JavaScript or video playback.
Until `SITE_URL` is set, image/canonical URLs are deliberately omitted rather
than publishing a made-up domain or localhost URL. **Set it and rebuild before
publishing to enable the sharing image.** Change it and rebuild if the domain
changes. Some platforms cache link previews; use their preview/debugging tools
to request a refresh after deployment. Actual preview appearance depends on
the platform and whether its crawler can access the page and PNG.

Static hosting uses the original local images instead of Next.js's server-side
image optimizer. The contact form still prepares an email draft; it does not
send messages from the server.

## Videos and GitHub

The hero and showcase currently use public Vercel Blob MP4 URLs in
`src/app/page.tsx` and `src/components/selected-work/projects.ts`.
The host must support byte-range requests for seeking. If captions are added,
the video host must also allow anonymous cross-origin requests. Use permanent
public URLs, not expiring private-store signatures. With these hosted URLs,
deployments from GitHub do not need the local videos.

`public/videos/` is deliberately excluded from Git. Several original videos
exceed GitHub's 100 MiB per-file limit; keep these files locally and back them
up separately. GitHub stores the source code, not the video library or the
generated `out/` folder.

- Building with local videos present also copies them into `out/videos/`.
  They are only required for deployment if the page's video URLs are changed
  to local `/videos/` paths.
- If self-hosting the videos, restore the backup into `public/videos/` before
  building, or upload the files separately while keeping their paths intact.
- `.env.example` is committed as a configuration template; real environment
  files remain ignored.

## Visual QA

The palette pairs warm cream and muted olive with the hero's dark moss and
lime. The fixed header has breakpoint-aware anchor offsets; content reflows
without cropping videos on smaller screens.

For layout changes, check viewport sizes at 320, 390, 768, 1024, 1366, and
1440px, including keyboard focus, reduced motion, contact validation, and
native video playback. Text contrast checks against composited CSS background
colors do not certify contrast over every video frame.
