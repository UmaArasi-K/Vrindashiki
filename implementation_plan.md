# Vrindashiki Implementation Plan

## Goal Description
Create a cross‑platform carbon footprint tracking app for individuals that:
- Tracks daily carbon emissions and maintains personal streaks.
- Allows optional visibility of streaks to a community, enabling small‑scale competition and neighborhood challenges.
- Integrates with fitness devices (Google Fit, Apple Health) and GPS for richer data.
- Follows Clean Architecture and SOLID principles with clear, understandable naming.
- Is deployable on Google Cloud, using serverless containers.
- Provides a responsive web application experience built with React and Vite, accessible primarily via the web but fully optimized for mobile devices.

## User Review Required
> **[IMPORTANT]** Review the chosen technologies and architectural decisions. If any choice does not match your expectations, let us know.

- **Privacy & Security First**: User privacy must be handled with utmost care. This is a core tenet of the app. All user data, especially health and location data, must be securely handled.
- **Platform**: Responsive Web App using React and Vite.
- **State Management**: Redux Toolkit (TypeScript).
- **Backend**: Cloud Run (containerized Node.js/Express API, TypeScript) exposing a RESTful JSON API.
- **Database**: Firestore (NoSQL, cheap, scalable).
- **Authentication**: Firebase Authentication (email/social) with future OAuth2 extensibility.
- **Fitness Integration**: Web APIs (like Web Bluetooth or generic OAuth integrations with fitness providers) or manual input if APIs are unavailable. **Must be strictly optional, require explicit user consent before connecting, and handle data securely.**
- **Deployment**: Cloud Run service behind a load balancer, CI/CD via GitHub Actions to GCP.
- **Gamified Dashboard (Neighborhood Building)**: The dashboard will be a game where users 'raise their neighborhood'. Points earned by tracking and reducing carbon footprints are used to decorate and improve the virtual neighborhood. It will feature customizable avatars and unlockable badges that occasionally grant 'decisive powers' in the game.
- **Notifications**: Implement a notification system (push notifications/email) for streak reminders.

## Proposed Changes
---
### Frontend (React + Vite)
- **src/** – Root source folder.
- **src/components/** – Reusable UI components (Card, StreakBadge, Leaderboard, etc.).
- **src/pages/** – App pages: Home, Track, Streaks, Community, Settings.
- **src/store/** – Redux Toolkit slices: `authSlice`, `footprintSlice`, `streakSlice`, `communitySlice`.
- **src/services/** – API client (axios instance), fitness integration wrappers.
- **src/routes/** – React Router DOM configuration.
- **src/theme/** – Design system (Vanilla CSS for maximum control) following premium aesthetic guidelines.
- **main.tsx** – Entry point, wraps App with Provider and Router.

---
### Backend (Node.js/Express, TypeScript)
- **src/** – Server source.
- **src/controllers/** – Controllers for each domain (auth, footprint, streak, community).
- **src/routes/** – Express routers, grouped by domain.
- **src/services/** – Business logic services adhering to Clean Architecture (use‑case classes).
- **src/repositories/** – Firestore repository implementations (interface ↔ concrete).
- **src/models/** – TypeScript interfaces / DTOs.
- **src/middleware/** – Auth verification, error handling, request logging.
- **src/app.ts** – Express app composition.
- **Dockerfile** – Container definition for Cloud Run.
- **cloudrun.yaml** – Deployment config (optional). 

---
### Infrastructure / DevOps
- **infra/** – Terraform or gcloud scripts to provision:
  - Firestore database.
  - Firebase Auth.
  - Cloud Run service.
  - CI/CD pipeline (GitHub Actions) that builds Docker image, pushes to Artifact Registry, deploys to Cloud Run.
- **.github/workflows/deploy.yml** – CI/CD workflow.

---
### Testing
- **frontend** – Vitest + React Testing Library for unit and integration tests.
- **backend** – Jest + Supertest for API routes, mock Firestore for unit tests.
- **e2e** – Cypress for end‑to‑end flows on the web (track emission, streak update, community view).

## Verification Plan
### Automated Tests
- Run `npm test` for both frontend and backend suites.
- CI pipeline ensures all tests pass before deployment.

### Manual Verification
- Deploy a staging Cloud Run instance.
- Install the Web app (PWA) on mobile devices or access via standard browsers.
- Verify:
  1. User can sign up/sign in via Firebase Auth.
  2. Emission entry updates streak correctly.
  3. Community toggle shows/hides streak on leaderboard.
  4. Fitness data syncs from Google Fit/Apple Health.
  5. PWA works offline with service workers.
  6. Deployment is reachable via HTTPS, scaling works.

---
**Next Steps**: Execution.
