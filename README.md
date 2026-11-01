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
      projects.ts                Reel and project media configuration
      selected-work.tsx          Vintage reel and interactive project player
      project-video.tsx          Visibility-aware full films and looping previews
      tv-wall.tsx                Accessible TV selection and WebGL fallback
      tv-wall-scene.ts            Lit Three.js cabinets and curved video screens
      selected-work.module.css   Selected work responsive styles
      vintage-reel.tsx           Playlist, typed narrative, and camera controls
      vintage-reel.module.css    Full-screen scene, narrative, and film overlay
      vintage-room.ts            Three.js room, era transition, and camera views
```

The portfolio sections are defined in `src/app/page.tsx`: hero, capabilities
and specializations, selected case studies, tools and workflow, and contact.
The capability, tool, and workflow content is kept in small arrays at
the top of that file so it is easy to edit section by section.

The capabilities section covers prompt-to-video generation, AI-assisted video
translation, automated SRT subtitle formatting, and custom processing pipelines.
Each entry includes technical focus areas and a deliverable description.

The Tech Stack & Workflow section pairs Gemini, Claude, Higgsfield, and Google
Flow with Photoshop, Premiere Pro, After Effects, and CapCut. Tools are grouped
by generative production and editing/finishing, with a practical role for each.
Its four-stage workflow covers direction, generation and iteration, editing,
and reviewed delivery. Edit `toolGroups` and `steps` in `src/app/page.tsx` to
adjust the toolkit, descriptions, and deliverables. This section is static,
uses the same dark moss/lime visual theme, and does not connect to AI services.
The two toolkit groups sit side by side on desktop with a small overlap and
tilt. Each card uses a compact two-by-two tool grid, with tighter section spacing
to keep the workflow heading visible below the cards on laptop screens.
Phones stack the cards with natural height to preserve readability.
Desktop cards have equal dimensions, rest at 93% scale, and lift to 103.5% on hover or keyboard focus.
Symmetrical layout overlap keeps their edges visibly layered even at the smaller resting size,
leaving a little more breathing room around the toolkit. Touch layouts use a smaller tilt; reduced-motion
disables transforms. Tool marks are local assets under `public/images/tools/`:
Gemini, Claude, and the Adobe app logos come from
[SVG Logos](https://github.com/gilbarbara/logos) (CC0), and CapCut from
[Lobe Icons](https://github.com/lobehub/lobe-icons) (MIT; license included alongside
the asset). Brand marks belong to their respective owners and do not imply
endorsement. Higgsfield and Google Flow use temporary initial badges as agreed;
replace their entries in `toolMarks` with local logo paths when assets are available.

## Adding project videos

Selected Work has two parts: an immersive Three.js room with a TV reel, and a
frameless modern player with a stacked vintage TV selection wall. Both use the
portfolio's dark green and lime theme. On smaller screens, the TV wall stacks below the
player; section heights can grow to keep all content accessible.

Save videos under `public/videos/`, then update
`src/components/selected-work/projects.ts`:

- Edit `reelClips` to configure the TV playlist. It currently uses all eight
  videos in `public/videos/showcase/`. Each clip plays its first eight seconds
  (or until it ends), then advances; the playlist wraps back to the beginning.
  Adjust `CLIP_PREVIEW_SECONDS` in `vintage-reel.tsx` to change preview length.
- The `projects` list currently derives eight entries from `reelClips`, using
  the supplied filenames for titles. Replace or expand these entries with
  your project category, description, and tags as needed.
- Each TV loops its project's `previewStart` to `previewEnd` range (initially
  0–8 seconds). Clicking a TV loads that project's full video into the left
  player from the beginning, including when the same TV is selected again,
  with separate controls for playback, seeking, sound, and fullscreen. On phones, selecting a TV
  scrolls back to the player.
- The main player has no card, border, or panel background. The feathered,
  asymmetrical contour in `public/images/player-fade.svg` blends the video's
  perimeter into the section. Playback controls are separate from the mask so
  they remain visible and usable; fullscreen removes the mask entirely.
- Optionally set `poster` to a preview image URL and `captions` to an English
  WebVTT caption file URL. Convert SRT files to WebVTT for browser playback.

A `null` source displays an explicit coming-soon placeholder without requesting
a missing video. Selecting a configured project replaces the previous video
and starts it muted when visible. TV previews load only when they enter the
viewport, pause off-screen or in a hidden tab, and remain still for reduced-motion
users. Reduced-motion users can still explicitly play a selected full film.
Preview loops are browser playback ranges, not separately encoded clips;
for production, short optimized preview files will reduce bandwidth and decoding
cost when many screens are visible.
The selection wall uses one transparent Three.js canvas, with eight procedural
3D CRT models: deep cabinets, rounded bezels, bowed video screens, metal tuning
dials, speaker grilles, side vents, and feet. Warm key light, cool fill, shadows,
and a lime selection rim give the stack depth without enclosing it in a card.
The existing preview video elements supply the textures; selecting a film does
not reload the other previews. HTML buttons remain keyboard-accessible and
define the responsive 2-3-3 layout. Hover/focus subtly turns a set; reduced-motion
applies changes instantly. Rendering pauses off-screen/when hidden, is capped
at 30 fps and 1.5 pixel density, and all GPU resources are disposed on unmount.
If WebGL fails or loses its context, an explicit notice appears and the standard
TV previews remain selectable.
The 3D room uses procedural seated figures, wood paneling, curtains, furniture,
and a vintage TV; it is a stylized interpretation, not a photorealistic model.
Clips are stretched to fill the TV screen without letterboxing. The room fills
the section edge to edge, without a card frame. Over 36 seconds of visible time,
the same TV cabinet, bezel, and video surface evolve through a wood-cabinet CRT,
an early widescreen set, a slim flat panel, and a near-borderless latest-generation
display. Each model has a short hold before the next smooth dimensional and
material transition; playback is never moved to a replacement screen.
The room evolves structurally alongside the TV: wood slats recede into smooth
plaster walls, gridded windows open into large panes, lace and portrait decor
retract, and the narrow drawer stand widens into a low minimalist media console.
Seating becomes lower-profile with slim arms and legs; the fringed rug becomes
a larger plain rug and the lampshade becomes a compact contemporary fixture.
Modern planters, abstract art, and architectural accents complete the final room.
Window area lights, warm lamp light,
ceiling illumination, and foreground bounce light keep the surroundings visible
through every era, with soft directional shadows for depth.
Three typewritten chapters cover video's role in shared culture, the connected
world, and creative technology. The final scene and narrative remain in place
while the muted clip playlist continues looping. Edit `CHAPTERS` and
`EVOLUTION_SECONDS` in `vintage-reel.tsx` to adjust the story and transition.

The Change Camera button cycles through the family-room, over-the-shoulder,
and close-up views. Rendering, playback, and the evolution clock pause when the
scene is off-screen or the browser tab is hidden. Reduced-motion users see the
final scene and complete text immediately, with video paused and camera changes
applied without animated movement. Three.js is loaded in a separate client chunk, pixel
density is capped, and rendering is limited to 30 fps.

If WebGL is unavailable, an explicit message and standard video player replace
the scene. Media errors are shown with an option to skip the clip. For deployment,
consider smaller web-optimized copies or a video CDN: the supplied clips include
files larger than 100 MB.

The fixed navbar lives in `src/components/site-header/`. It shares the hero's
3.5-second reveal, remains transparent at the top, and adds a moss background
after 16px of scrolling. Scrolling also makes navigation immediately available
if the initial reveal has not finished. All five links match the page sections;
smaller screens use an accessible toggle menu. Anchor scroll padding keeps
section headings below the navbar. The name and page metadata use Mark Harvey
Leduna. The footer credit links to `https://asuratectsolutions.com` as supplied.

Before publishing, replace generic project descriptions with real project details.

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
videos, and a branded 1200 x 630 PNG at `out/share-preview.png`.
Do not create a separate `public/index.html`: it would duplicate the Next.js
homepage rather than export the application.

1. Once you choose a domain, copy `.env.example` to `.env.local` and replace
   `SITE_URL` with the final HTTPS origin, for example `https://your-domain.com`.
   This site is configured to be hosted at the domain root, not a subfolder.
2. Run `npm run lint` and `npm run build`.
3. Upload the **contents** of `out/` into the domain's cPanel document root
   (usually `public_html`), including `_next/`, `images/`, and `videos/`.
   Keep all exported paths intact. No Node.js server is required.
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

`public/videos/` is deliberately excluded from Git. Several original videos
exceed GitHub's 100 MiB per-file limit; keep these files locally and back them
up separately. GitHub stores the source code, not the video library or the
generated `out/` folder.

- Building on this computer still copies the local videos into `out/videos/`.
  Upload those files directly to cPanel using its file manager or SFTP, keeping
  the same filenames and subfolders.
- After a fresh clone, restore your video backup into `public/videos/` **before**
  building. Otherwise the exported site will not contain the films referenced
  by the page.
- For later code-only updates, keep the already-uploaded `videos/` directory on
  the server. Do not use a deployment sync that deletes the separately managed
  videos.
- `.env.example` is committed as a configuration template; real environment
  files remain ignored.

## Visual QA

The palette uses dark moss, cream, and lime; `--text-secondary` in
`src/app/globals.css` keeps secondary copy legible across the dark surfaces.
Section labels use at least 10px type, toolkit body copy uses 12px type, and
the main sections share 6% desktop gutters (7% on phones). Toolkit copy is
intentionally concise so the overlapping cards and workflow heading remain
visible together at 1366 x 768. On narrower screens content grows naturally
rather than being clipped or reduced to unreadable text.

The mobile player keeps its controls below the masked video, with 44px buttons
and a full-width seek row. The fixed header has breakpoint-aware anchor offsets;
the immersive room's heading clears it even while scrolling through the scene.
For layout changes, check settled viewport sizes at 320, 390, 768, 1024, 1366,
and 1440px, including short landscape screens, keyboard focus, reduced motion,
card hover/overlap, contact validation, and video selection. Text contrast checks
against composited CSS background colors are useful but do not certify contrast
over every video frame or gradient.
