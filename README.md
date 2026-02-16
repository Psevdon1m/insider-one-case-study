# Horse Race Simulation — Frontend Developer Case Study

A Vue 3 desktop application that simulates a 6-round horse racing game with 20 horses, condition tracking, and a modular DDD-inspired architecture. Built with Composition API, TypeScript, Pinia, Vue Router, Tailwind CSS, and delivered as a PWA with E2E tests and GitHub Pages deployment.

---

## Table of Contents

- [Requirements Met](#requirements-met)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [CI/CD & Deployment](#cicd--deployment)
- [PWA & Offline](#pwa--offline)
- [Project Structure](#project-structure)

---

## Requirements Met

| Requirement | Implementation |
|------------|----------------|
| **20 horses** | Pool of 20 horses with unique names and colors |
| **Unique colors** | Each horse has a distinct color (domain-driven generation) |
| **Condition score 1–100** | Horse condition stored and displayed; degrades after rounds |
| **6 rounds** | Exactly 6 rounds per race |
| **10 horses per round** | 10 random horses selected from the 20 for each round |
| **Round distances** | Round 1: 1200 m → Round 6: 2200 m (200 m step) |

**Round distances (meters):**

- Round 1: 1200  
- Round 2: 1400  
- Round 3: 1600  
- Round 4: 1800  
- Round 5: 2000  
- Round 6: 2200  

---

## Tech Stack

- **Vue 3** — Composition API
- **TypeScript**
- **Pinia** — state management
- **Vue Router** — routing (modular, merged from modules)
- **Tailwind CSS v4** — styling
- **Vite 7** — build and dev server
- **@vueuse/core** — composables (e.g. `useThrottleFn`)
- **unplugin-auto-import** — auto-import for Vue APIs, Pinia, composables, stores
- **unplugin-vue-components** — auto-import for components
- **Cypress** — E2E tests (Chrome & Firefox)
- **PWA** — service worker + web manifest for install and offline caching

---

## Project Architecture

The app uses a **lite DDD-style** structure with two main layers:

### `src/core`

Shared application shell and cross-cutting concerns:

- **`components/shared`** — e.g. `MobileNotSupported.vue` (desktop-only cover)
- **`components/ui`** — reusable UI: `BaseButton`, `BaseHeader`, `CountDown`, `HorseSilhouette`
- **`composables`** — e.g. `useWindowResize` for viewport/resize tracking
- **`router`** — global router that merges base routes with module routes

### `src/modules`

Feature modules. Currently:

- **`race`** — horse racing game

Each module can contain:

- **`composables`** — domain logic (e.g. `useRace`: progress, speed, condition, tireness)
- **`components`** — feature-specific UI
- **`domain`** — types, constants, horse generation (names, colors), round distances
- **`routes`** — route definitions for the module
- **`store`** — Pinia store (e.g. `horseStore`: horses, program, results, actions)
- **`views`** — page-level components (e.g. `Dashboard.vue`)

This keeps features isolated and makes it easy to add or change functionality without touching the rest of the app.

---

## Features

### Core Game

- 20 horses with unique names and colors; condition 1–100.
- 6 rounds with distances 1200 m → 2200 m (200 m steps).
- 10 random horses per round; program generation and round-by-round execution.
- **Reset race** after all 6 rounds.

### UX & Visuals

- **Desktop-only**: mobile detection shows a cover (`MobileNotSupported`) instead of the game.
- **Animations**: running horse during race; standing horse when paused/finished/not started.
- **Horse list**: border highlight for the 10 horses selected in the current round.
- **Condition feedback**: after a round, horses that ran show a red marker and arrow next to their condition to indicate decrease.

### Logic & Data

- **Last-horse distance**: while racing, distance covered by the slowest horse is derived from min progress and speed.
- **Fastest horse speed**: displayed in km/h from speed and distance.
- **Tireness**: after each round, random tireness is applied and condition of horses that ran is decreased.

### Developer Experience

- **Auto-imports**: Vue APIs (`ref`, `computed`, `watch`, etc.), Pinia helpers, composables, stores, and all components from `src/core/components` and `src/modules/**/components` — no manual imports for these.

---

## Getting Started

### Prerequisites

- **Node.js** 22.x (e.g. 22.14.0)
- **npm** (or use the project’s lockfile with `npm ci`)

### Install & Run

```bash
# Install dependencies
npm ci

# Development
npm run dev
```

App runs at `http://localhost:5173` (or the URL shown in the terminal). Base path for production/GitHub Pages is `/insider-one-case-study/`.

### Build

```bash
npm run build
```

Output is in `dist/`. Preview with:

```bash
npm run preview
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`vue-tsc -b`) and Vite build |
| `npm run preview` | Serve `dist` (e.g. port 5173) |
| `npm run cypress:open` | Open Cypress UI |
| `npm run cypress:run` | Run Cypress E2E (Chrome) |

---

## Testing

E2E tests are in **Cypress** under `cypress/e2e/`.

### Coverage

1. **Dashboard loading** — race dashboard loads; horse list is present.
2. **Horse display** — all 20 horses rendered; name and condition visible.
3. **Program generation** — button generates program; 10 horses per round; silhouettes on track.
4. **Race start** — start button shows track; horses move (CSS `left` changes).
5. **Single round completion** — wait for first round to finish; results table has 10 horses for that round.

Custom commands (e.g. in `cypress/e2e/support/commands.ts`) are used for: `visitRaceDashboard`, `generateProgram`, `startRace`, `waitForRoundCompletion`, etc.

### Run tests

```bash
# Interactive
npm run cypress:open

# Headless (Chrome)
npm run cypress:run
```

---

## CI/CD & Deployment

**Workflow file:** `.github/workflows/main.yaml`

- **Triggers:** push to `main` or `development`.

### Pipeline

1. **Install job**
   - Node 22, `npm ci`, single **build**.
   - **Artifact:** `dist` (build output).

2. **Test jobs (parallel)**
   - **Chrome** and **Firefox** both use the same build artifact (no rebuild).
   - Serve app with `npm run preview`, wait for `http://localhost:5173/insider-one-case-study/`.
   - Run all specs under `cypress/e2e/**`.
   - Upload Cypress videos/screenshots as artifacts.

3. **Deploy job**
   - Runs only on **main**, after both browser tests pass.
   - Uses **GitHub Pages** environment.
   - Deploys the same `dist` artifact to Pages.

Result: one build, parallel Chrome + Firefox tests, then deploy on success.

---

## PWA & Offline

The app is a **Progressive Web App**:

- **`public/manifest.webmanifest`** — name, icons, display, etc., so the app can be installed on desktop.
- **`public/sw.js`** — service worker that caches critical assets so the app works **offline** after first load.
- **`src/core/registerSW.ts`** — registers the service worker in the app.

Users can install the race simulation as an app and use it with cached resources when offline.

---

## Project Structure

```
src/
├── core/
│   ├── components/
│   │   ├── shared/          # e.g. MobileNotSupported.vue
│   │   └── ui/              # BaseButton, BaseHeader, CountDown, HorseSilhouette
│   ├── composables/         # e.g. useWindowResize
│   ├── router/              # Global router + module route merging
│   └── registerSW.ts        # PWA service worker registration
├── modules/
│   └── race/
│       ├── composables/     # useRace (progress, speed, condition, tireness)
│       ├── components/     # HorseList, RaceTrack, ProgramList, ResultsList, ResultsAndProgramWrapper
│       ├── domain/         # types, constants (round distances), horses (names, colors, factory)
│       ├── routes/         # Race module routes
│       ├── store/          # horseStore (horses, program, results, actions)
│       └── views/          # Dashboard.vue (header, HorseList, RaceTrack, ResultsAndProgramWrapper)
├── App.vue
└── main.ts

cypress/
├── e2e/
│   ├── race/                # race-simulation.cy.ts
│   ├── support/             # commands, e2e.ts
│   └── fixtures/
└── cypress.config.ts

public/
├── manifest.webmanifest
├── sw.js
└── icons/
```

---

## License

Private — case study project.
