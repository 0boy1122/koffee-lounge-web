import fs from "node:fs";
import path from "node:path";

const DB_NAME = "koffee_lounge";
const DB_USER = "koffee";
const DB_PASSWORD = "koffee";
const DB_PORT = 5433;
const DATA_DIR = path.join(__dirname, "..", ".pg-data");

let pg: any;

async function getPostgres(): Promise<any> {
  if (pg) return pg;
  const { default: EmbeddedPostgres } = await import("embedded-postgres");
  pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    persistent: true,
  });
  return pg;
}

let started = false;

/**
 * Boots a local, project-scoped Postgres server (no system install / admin
 * rights required) so `npm run dev` works out of the box. Only used when
 * DATABASE_URL isn't already set to a real (hosted) database.
 */
export async function ensureDevDatabase(): Promise<string> {
  const connectionUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}`;

  if (started) return connectionUrl;
  const database = await getPostgres();

  // `initialise()` runs `initdb`, which refuses to run against a directory
  // that already holds a cluster — so only run it the first time.
  const alreadyInitialised = fs.existsSync(path.join(DATA_DIR, "PG_VERSION"));
  if (!alreadyInitialised) {
    await database.initialise();
  }
  await database.start();
  started = true;

  const client = database.getPgClient();
  await client.connect();
  const { rows } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DB_NAME]
  );
  if (rows.length === 0) {
    await pg.createDatabase(DB_NAME);
  }
  await client.end();

  process.on("SIGINT", stopDevDatabase);
  process.on("SIGTERM", stopDevDatabase);

  return connectionUrl;
}

export async function stopDevDatabase(): Promise<void> {
  if (!started) return;
  started = false;
  if (pg) await pg.stop();
  process.exit(0);
}
