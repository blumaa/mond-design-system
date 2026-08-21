#!/usr/bin/env node
/* Both `--pending` and `hook` judge text that is not on disk yet, so it arrives
   on stdin: a hook firing before a write has the content and nowhere to put
   it, and the hook protocol is stdin JSON in and stdout JSON out. */
import { readFileSync } from "node:fs";
import { main } from "./main.js";

const argv = process.argv.slice(2);
const wantsStdin = argv[0] === "hook" || argv.includes("--pending");
const stdin = wantsStdin ? readFileSync(0, "utf8") : undefined;

process.exitCode = main(argv, stdin);
