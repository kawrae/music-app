# music-app

## Abstract

This music-app is a mobile-first React single-page application designed to capture, organise, and review music ideas in one interface, the project supports track creation with text notes, cover images, and audio clips, then persists those records using browser-based storage so the app can run without a backend.

This repository is structured as a standalone submission-ready codebase with clear separation of pages, reusable components, and data utilities.

## Project Purpose and Scope

This music-app allows users to store voice memos, upload tracks or write down ideas / memos all in one workflow.

Primary goals:

- Provide end-to-end local CRUD operations for track ideas.
- Deliver a responsive UI suitable for mobile and desktop usage.
- Demonstrate browser storage and device API integration in a frontend-only architecture.

## Key Features

- Track creation with title, type, and notes.
- Audio attachment and in-app playback.
- Cover image upload/capture and square-crop processing.
- Track editing, deletion, and favourite toggling.
- Search over title, notes, and track type.
- Persistent client-side storage for metadata and media.

## Technology Stack

- Frontend framework: React 19
- Build tool: Vite 8
- Routing: React Router 7
- Styling: Tailwind CSS 3
- Animation: Framer Motion
- Local database: Dexie (IndexedDB wrapper)
- Utilities: Nano ID, Lucide icons
- Quality tooling: ESLint

## Architecture Overview

- Routing is defined in `src/App.jsx` for three main routes: landing, dashboard, and library.
- Page-level orchestration lives in `src/pages/`, while reusable UI logic lives in `src/components/`.
- Persistent metadata state is managed by `src/hooks/usePersistedState.js` (localStorage).
- Media assets (audio and cover art) are managed by `src/db.jsx` using IndexedDB via Dexie.

### Storage Design

- localStorage: Lightweight track metadata (title, notes, type, favourites, timestamps).
- IndexedDB: Larger binary/media payloads (audio data URLs, cover image data URLs).

This separation improves maintainability and mirrors realistic client-side data modelling for media-heavy applications.

## Browser and Device API Usage

The project demonstrates multiple browser/device APIs:

- FileReader API: Converts selected files to storable data URLs.
- Camera capture (file input capture flow): Supports direct media acquisition on mobile.
- MediaRecorder API: Captures audio directly from the user’s device (e.g. microphone/voice recording).
- Canvas API: Crops and normalises image assets.
- Notification API: Provides user status feedback.
- Vibration API: Adds tactile confirmation for key interactions (supported devices only).

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ (bundled with modern Node.js versions)

## Installation and Local Development

1. Clone the repository:

	```bash
	git clone https://github.com/kawrae/music-app.git
	cd music-app
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Start the development server:

	```bash
	npm run dev
	```

4. Open the local URL printed by Vite (typically `http://localhost:5173`).

## Build and Preview

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Deployment

The repository includes `vercel.json` with SPA rewrite rules so route refreshes resolve correctly to `index.html`.

### Deploy with Vercel (Recommended)

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Use the default Vite settings:
	- Build command: `npm run build`
	- Output directory: `dist`
4. Deploy.

### Optional Vercel CLI Deployment

```bash
npm install -g vercel
vercel
vercel --prod
```


This repository was created by moving/copying the project from the original `dwt>assessment` repository into a dedicated standalone repository for clarity and cleaner project presentation. As a result, commit history from the source repository was not carried into this new repository.

## Academic Integrity and Usage

- This project is an educational submission artifact.
- External libraries are used as declared in `package.json`.

## License

This project is distributed under the Unlicense license.

