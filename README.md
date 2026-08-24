# MyCineZone

Movie ticket booking app, migrated from a flat PHP/MySQL codebase to a
TypeScript monorepo: Express API + React SPA, same MySQL engine underneath.

See [`migration.md`](./migration.md) for the full migration plan and
[`legacy/PROJECT_REFERENCE.md`](./legacy/PROJECT_REFERENCE.md) for the
as-received technical snapshot of the original app.

## Layout

```
client/   React SPA (Vite + TypeScript)
server/   Express API (TypeScript, Prisma/MySQL)
shared/   Types/constants shared by client and server
scripts/migrate-data/   One-time legacy MySQL -> new MySQL data migration
legacy/   Original PHP app, kept for reference during the rewrite
```

## Getting started

```bash
npm install                                    # installs all workspaces

cp server/.env.example server/.env             # fill in DB + secrets
cp client/.env.example client/.env.local
cp scripts/migrate-data/.env.example scripts/migrate-data/.env

npm run prisma:migrate --workspace=server       # create the new schema
npm run seed --workspace=server                 # bootstrap the super-admin

# optional, only if migrating data from a running legacy install:
npm run migrate --workspace=scripts/migrate-data

npm run dev                                     # server on :4000, client on :5173
```
