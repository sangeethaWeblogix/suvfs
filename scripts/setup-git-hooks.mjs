// Runs on `npm install` (the "prepare" script): points git at .githooks so
// every collaborator gets the [sites: …] commit hint. Silently does nothing
// where there is no git checkout (e.g. Vercel builds).
import { execSync } from "node:child_process";

try {
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch {
  // not a git repo / git not installed — nothing to set up
}
