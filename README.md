# HomeDecorator

HomeDecorator is a web app that lets you redesign any room using AI. Upload a photo of your space, pick a room type, style, and lighting preference — and the AI generates a transformed version of your room in seconds.

## What it does

- Upload a room photo — any angle, any lighting.
- Choose a style — from modern minimalism to cozy rustic and more.
- Get AI-generated results — see your room reimagined instantly.

User accounts are required to generate images. Authentication is handled via Firebase, and each user has a limited number of generations.

## Tech stack

- [Angular 21](https://angular.dev) — frontend framework
- [Firebase](https://firebase.google.com) — authentication and backend
- [Tailwind CSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) — styling
- Deployed on [Netlify](https://netlify.com)

## Running locally

Prerequisites: Node.js 18+ and the [Angular CLI](https://angular.dev/tools/cli) installed globally.

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/your-username/home-decorator.git
   cd home-decorator
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:4200/` and reloads automatically on file changes.

3. To run with explicit development configuration:

   ```bash
   npm run start:dev
   ```

## Other commands

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `npm run build`     | Production build              |
| `npm run build:dev` | Development build             |
| `npm test`          | Run unit tests with Karma     |
| `npm run test:ci`   | Run tests headlessly (for CI) |
