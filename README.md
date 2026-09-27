# Earth Growth Garden

An interactive React experience that visualizes collective participation as a growing digital garden. The project combines a Vite/React front end with a lightweight Express + Socket.IO server for shared contribution state.

The application source is currently stored inside the `earth-growth-garden-main/` directory.

## Features

- live shared contribution counter;
- participant count through Socket.IO connections;
- animated garden/tree visualization;
- progress and milestone feedback;
- contribution action with cooldown behavior;
- responsive React UI;
- lightweight local Node/Express server.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui / Radix UI
- Socket.IO
- Express
- Vitest
- Playwright

## Run Locally

```bash
git clone https://github.com/KVL3159H/earth-growth-garden-main.git
cd earth-growth-garden-main/earth-growth-garden-main
npm install
```

Start the front end:

```bash
npm run dev
```

The project also includes `server.js` for Socket.IO-based shared state. Run it with Node when testing multi-client participation.

## Environment

Use a local `.env` file for environment-specific backend configuration:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Do not commit real environment files or temporary tunnel URLs.

## Architecture

```text
Browser clients
     |
     | Socket.IO
     v
Express / Socket.IO server
     |
     v
Shared in-memory contribution state
```

The current server intentionally keeps state in memory, so counts reset when the server restarts.

## Testing

```bash
npm run test
npm run lint
npm run build
```

## Production Notes

Before public production deployment:

- persist contribution state in a database;
- restrict CORS to trusted origins;
- add abuse/rate-limit protection;
- validate all client events server-side;
- move environment-specific URLs to deployment secrets/config;
- add health checks and structured logging.

## Contributing

Useful contributions include persistence, accessibility, test coverage, deployment documentation, and abuse-resistant server-side validation.

---

Built as a collaborative digital-garden experiment using React and real-time web communication.
