FROM oven/bun:1.1.6

WORKDIR /app
COPY . .

RUN bun install

# Optional: run migrations at container start (not at build time)
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
