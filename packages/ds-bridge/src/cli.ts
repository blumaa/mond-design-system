#!/usr/bin/env node
/* `--pending` judges text that is not on disk yet, so it arrives on stdin: a
   hook firing before a write has the content and nowhere to put it. */
import { readFileSync } from "node:fs";
import { main } from "./main.js";

const argv = process.argv.slice(2);
const stdin = argv.includes("--pending") ? readFileSync(0, "utf8") : undefined;

process.exitCode = main(argv, stdin);
