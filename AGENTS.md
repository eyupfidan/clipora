# AGENTS.md

This file provides instructions for AI coding agents working on this repository.

## Project Summary

Keep Notes is a single-user Google Keep-style note application built with Next.js App Router, TypeScript, Prisma, SQLite, Tailwind CSS, and Server Actions.

The application is intentionally local-first and does not include authentication, user accounts, or remote synchronization.

## Package Manager

Use `pnpm` for all package operations.

Preferred commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm prisma migrate dev
pnpm prisma generate
```

If `pnpm` is unavailable in the current shell, use Corepack:

```bash
corepack pnpm install
corepack pnpm build
```

Do not introduce `npm` or `yarn` lockfiles. Keep `pnpm-lock.yaml` as the only package lockfile.

## Architecture Guidelines

- Use Next.js App Router conventions.
- Prefer Server Actions for mutations unless a route handler is clearly more appropriate.
- Keep Prisma access inside `lib/` helpers or server-only actions.
- Keep reusable UI in `components/`.
- Keep shared TypeScript types in `types/`.
- Keep translation metadata and UI strings in `lib/i18n.ts`.
- Do not add authentication or user models unless explicitly requested.

## Database Guidelines

- Prisma schema lives in `prisma/schema.prisma`.
- SQLite is configured through `DATABASE_URL`.
- Notes are soft-deleted with `isDeleted`; do not hard-delete except through the permanent delete flow.
- Archived notes use `isArchived`.
- Pinned notes use `isPinned`.
- Labels are stored separately and connected through `NoteLabel`.

## UI Guidelines

- Preserve the Google Keep-inspired visual direction: simple, quiet, card-based, and responsive.
- Keep desktop sidebar and mobile drawer behavior working independently.
- Maintain accessible labels for icon-only buttons.
- Use lucide-react icons for toolbar and navigation actions.
- Keep animations subtle and respect `prefers-reduced-motion`.
- Avoid large unrelated redesigns when implementing feature fixes.

## Internationalization

- English is the default language.
- The current language is stored in both `localStorage` and the `keep-notes-language` cookie.
- When adding new UI text, add the key to every language in `lib/i18n.ts`.
- Turkish translations must use proper Turkish characters such as `ç`, `ğ`, `ı`, `İ`, `ö`, `ş`, and `ü`.

## Validation Rules

Preserve these application rules:

- Do not save empty notes.
- A note must have a title or content.
- Do not allow empty label names.
- Do not create duplicate labels.
- Do not show deleted notes in normal lists.
- Do not show archived notes on the home page.
- Display pinned notes before other active notes.

## Verification

After meaningful changes, run:

```bash
pnpm lint
pnpm build
```

If Prisma schema or generated client behavior changes, also run:

```bash
pnpm prisma generate
```

For database schema changes, create a migration with:

```bash
pnpm prisma migrate dev
```

## Development Notes

- Do not commit generated `.next` output.
- Do not commit local SQLite database files unless explicitly requested.
- Keep changes focused and avoid unrelated refactors.
- Prefer small, explicit components over broad abstractions.
