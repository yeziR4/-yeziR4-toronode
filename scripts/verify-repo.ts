/**
 * verify-repo — CI-gate proof that ToroNode compiles, passes lint, and
 * runs its test suite.
 *
 * Usage: npx ts-node scripts/verify-repo.ts
 *
 * Exit codes: 0 = pass, 1 = fail
 */

import { execSync } from "child_process";

let failures = 0;

function run(label: string, cmd: string): void {
  process.stdout.write(`  ${label} ... `);
  try {
    execSync(cmd, { stdio: "pipe", encoding: "utf-8", timeout: 120_000 });
    process.stdout.write("ok\n");
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; status?: number };
    process.stdout.write("FAIL\n");
    console.error(err.stderr ?? err.stdout ?? String(e));
    failures++;
  }
}

console.log("ToroNode repo verification\n");

run("TypeScript compile", "npx tsc --noEmit");
run("Run test suite", "npx jest --runInBand");
run("ESLint", "npx eslint src/**/*.ts --max-warnings 0");

console.log(
  `\n${failures === 0 ? "PASS" : "FAIL"} — ${failures} failure(s)\n`,
);
process.exit(failures > 0 ? 1 : 0);
