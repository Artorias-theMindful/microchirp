#!/bin/sh
set -e

# Optional: wait for Postgres here if needed

# Run DB migrations
bunx knex migrate:latest --knexfile db/knexfile.js

# Run the app directly (no build)
bun index.ts
