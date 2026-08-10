import "dotenv/config";
import { spawn } from "node:child_process";
import { ensureDevDatabase, stopDevDatabase } from "../src/dev-db";

function run(command: string, args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", env, shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  // This script's whole job is to prepare the local dev database, so it
  // always boots the embedded Postgres server regardless of what's in .env.
  const databaseUrl = await ensureDevDatabase();
  const env = { ...process.env, DATABASE_URL: databaseUrl };

  console.log("Running migrations...");
  await run("npx", ["prisma", "migrate", "dev", "--name", "init"], env);

  console.log("Seeding database...");
  await run("npx", ["tsx", "prisma/seed.ts"], env);

  console.log("Done. Stopping local dev database.");
  await stopDevDatabaseIfRunning();
}

async function stopDevDatabaseIfRunning() {
  try {
    await stopDevDatabase();
  } catch {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
