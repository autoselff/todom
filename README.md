# todom

Minimal self-hosted Kanban board for planning and tracking tasks. Next.js, React, TypeScript and PostgreSQL, with a soft gruvbox-inspired light and dark theme.

### Boards
<img width="3840" height="2160" alt="Screenshot_20261025_172008" src="https://github.com/user-attachments/assets/fc0c84e7-d4dc-4aa2-b9b2-ef20ced5862b" />


### Board
<img width="3840" height="2160" alt="Screenshot_20261025_172029" src="https://github.com/user-attachments/assets/59094239-5748-414e-a13d-7ad408cba65d" />


### Editing a card
<img width="3840" height="2160" alt="Screenshot_20261025_172053" src="https://github.com/user-attachments/assets/93458ea7-b7d5-4eb5-b4b5-cc4baafff98a" />


## Features

- **Boards, columns and cards** – drag cards between columns and reorder columns
- **Inline editing** – rename boards and columns right where they are
- **Badges** – tag cards with one of seven muted colors
- **Light and dark theme** – follows your system, switchable in the top right corner
- **Self-hosted** – your data stays in your own PostgreSQL database

## Getting started

You need [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) 20+.

```sh
git clone https://github.com/autoselff/todom.git
cd todom
make setup
make up
```

Then open [http://localhost:3000](http://localhost:3000).

`make setup` starts PostgreSQL in Docker (port `5433`), creates `.env`, installs dependencies and syncs the database schema. You only need to run it once.

| Command      | What it does                         |
| ------------ | ------------------------------------ |
| `make up`    | Start the database and dev server    |
| `make down`  | Stop the database                    |
| `make db`    | Start only the database              |
| `make setup` | First-time setup                     |

### Without make

Point `DATABASE_URL` in `.env` at any PostgreSQL database (see `.env.example`), then:

```sh
npm install
npx prisma db push
npm run dev
```

For production use `npm run build && npm start`.

## Stack

[Next.js](https://nextjs.org/) 16 · [React](https://react.dev/) 19 · TypeScript · [Prisma](https://www.prisma.io/) · PostgreSQL 16
