# backend

## Setup

```bash
bun install
bunx prisma generate
```

Copy `.env` and set your values:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/traveloop"
PORT=4000
```

Run migrations (requires Postgres running):

```bash
bunx prisma migrate dev
```

## Run

```bash
bun dev        # watch mode
bun run src/app.ts  # single run
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | list users |
| GET | `/users/:id` | get user |
| POST | `/users` | create user |
| PUT | `/users/:id` | update user |
| DELETE | `/users/:id` | delete user |
| GET | `/trips` | list trips |
| GET | `/trips/:id` | get trip |
| POST | `/trips` | create trip |
| PUT | `/trips/:id` | update trip |
| DELETE | `/trips/:id` | delete trip |
