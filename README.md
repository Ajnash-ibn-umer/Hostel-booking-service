# Hostel Booking Service

Full-stack web application for managing hostels, rooms and bookings. The project is split into a Next.js client and a NestJS GraphQL server.

## Project structure

- `client/` – React client built with Next.js, TypeScript, Tailwind CSS and shadcn/ui.
- `server/` – NestJS GraphQL API for managing hostel data and authentication.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# install server dependencies
cd server
npm install

# install client dependencies
cd ../client
npm install
```

## Environment variables

The client expects the following variables in `.env.local`:

- `NEXT_PUBLIC_BACKEND_URL` – URL of the backend server (default `http://localhost:8000`).
- `NEXT_PUBLIC_API_ENDPOINT` – GraphQL endpoint path (default `graphql`).

The server uses standard NestJS configuration via `.env`; ensure database and other settings are provided.

## Running locally

Start the backend:

```bash
cd server
npm run start:dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The client will be available at `http://localhost:3000` and proxy API calls to the backend.

## Building for production

```bash
# build and start server
cd server
npm run build
npm run start:prod

# build and start client
cd ../client
npm run build
npm start
```

## Testing and linting

Run tests or lints in their respective packages:

```bash
cd client
npm test      # currently not implemented
npm run lint  # run Next.js linting

cd ../server
npm test      # run backend tests
```

---

This project is provided as a starting point for a hostel booking platform. Contributions and suggestions are welcome.
