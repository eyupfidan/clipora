<div align="center">

# Clipora

**A local-first note-taking app inspired by Google Keep**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Create, organize, search, archive, and manage notes in a clean, responsive workspace — powered by Next.js App Router, Server Actions, and SQLite.

[Features](#features) · [Quick Start](#quick-start) · [Project Structure](#project-structure) · [License](#license)

</div>

---

## Overview

Clipora is a production-oriented, extensible note-taking application built for a single local user. Notes persist in SQLite through Prisma, while the architecture stays open for future multi-user or SaaS extensions.

There is no authentication layer, user accounts, or remote sync — everything runs locally on your machine.

## Features

| Category | Capabilities |
| --- | --- |
| **Notes** | Create, edit, pin, archive, soft-delete, restore, and permanently delete |
| **Organization** | Labels, label filtering, search across titles and content |
| **Presentation** | Pastel Keep-style colors, grid and list layouts, pinned notes first |
| **UI/UX** | Responsive header, collapsible sidebar, mobile drawer, modal editing |
| **i18n** | 10 languages with English as default (EN, TR, ES, FR, DE, AR, HI, ZH, PT, RU) |
| **Stack** | Server Actions, Prisma ORM, subtle animations with reduced-motion support |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS, lucide-react
- **Data:** Prisma ORM, SQLite
- **Mutations:** Server Actions
- **Package manager:** pnpm 9

## Requirements

- **Node.js** 20 or newer
- **pnpm** 9 or newer

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-username/clipora.git
cd clipora
pnpm install
```

### 2. Configure environment

Copy the example env file and point Prisma at a local SQLite database:

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
```

### 3. Set up the database

```bash
pnpm prisma migrate dev
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm prisma migrate dev` | Apply database migrations |
| `pnpm prisma generate` | Regenerate Prisma Client after schema changes |

## Project Structure

```text
app/
  actions.ts                 Server Actions for note mutations
  page.tsx                   Active notes
  archive/page.tsx           Archived notes
  trash/page.tsx             Deleted notes
  labels/[label]/page.tsx    Label-filtered notes
components/
  layout/                    App shell, header, sidebar
  notes/                     Note cards, editor, modal, pickers, toolbar
  ui/                        Empty state, masonry grid
  providers/                 Language context
lib/
  prisma.ts                  Prisma Client singleton
  notes.ts                   Query helpers
  colors.ts                  Note color palette
  i18n.ts                    Translations and language metadata
prisma/
  schema.prisma              Database schema
types/
  note.ts                    Shared TypeScript types
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Active notes, creation, search, grid/list toggle |
| `/archive` | Archived notes with unarchive actions |
| `/trash` | Deleted notes with restore and permanent delete |
| `/labels/[label]` | Notes filtered by label |

## Data Model

```prisma
model Note {
  id         String
  title      String
  content    String
  color      String
  isPinned   Boolean
  isArchived Boolean
  isDeleted  Boolean
  createdAt  DateTime
  updatedAt  DateTime
  labels     NoteLabel[]
}

model Label {
  id        String
  name      String
  createdAt DateTime
  notes     NoteLabel[]
}

model NoteLabel {
  noteId  String
  labelId String
}
```

## Validation Rules

- Empty notes are not saved — a note must have a title or content
- Empty label names are rejected; duplicate label names are blocked by the database
- Deleted notes are hidden from active lists; archived notes are hidden from the home page
- Pinned notes always appear above other active notes

## Internationalization

The default language is English. The language switcher persists the selection in both `localStorage` and the `keep-notes-language` cookie so server-rendered pages reflect the choice immediately after refresh.

## License

This project is licensed under the [MIT License](LICENSE).
