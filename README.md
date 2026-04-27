# HomeDecorator

HomeDecorator is a web app that lets you redesign any room using AI. Upload a photo of your space, pick a room type, style, and lighting preference — and the AI generates a transformed version of your room in seconds.

## What it does

- Upload a room photo — any angle, any lighting.
- Choose from 11 room types (living room, bedroom, kitchen, and more).
- Pick a design style — modern, Scandinavian, Japandi, bohemian, and more.
- Select lighting conditions — daylight, golden hour, ambient, dramatic, or studio.
- Get AI-generated results — see your room reimagined instantly.
- Browse and manage your previously generated images.

## Architecture

The frontend is a standalone Angular 21 SPA communicating with a separate backend API (configured via `environment.backendEndpoint`). User authentication is handled by Firebase; the Firebase ID token is exchanged for a session cookie managed by the backend. Generated images are stored and served from Cloudflare R2.

```
Frontend (Angular) → Backend API (Cloudflare Worker) → AI image generation
                   ↘ Firebase Auth (ID token exchange)
                   ↘ Cloudflare R2 (image storage/delivery)
```

Each user account has a limited number of available image generations (`availableImagesCount`).

## Tech stack

- [Angular 21](https://angular.dev) — standalone components, signals, functional guards & interceptors
- [Firebase](https://firebase.google.com) — email/password authentication
- [Tailwind CSS v4](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) — styling
- [Cloudflare R2](https://developers.cloudflare.com/r2/) — generated image storage
- Deployed on [Netlify](https://netlify.com)

## Getting started

### Prerequisites

- Node.js 20+
- A Firebase project with email/password auth enabled
- A running backend API (see `environment.backendEndpoint`)

### Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Configure your environment by editing `src/environments/environment.development.ts`:

   ```ts
   export const environment = {
     production: false,
     backendEndpoint: "http://localhost:8787",
     storageUrl: "https://<your-r2-bucket>.r2.dev",
   };
   ```

3. Add your Firebase config to `src/app/core/libs/firebase.ts`.

4. Start the dev server:

   ```bash
   npm run start:dev
   ```

   The app will be available at `http://localhost:4200`.
