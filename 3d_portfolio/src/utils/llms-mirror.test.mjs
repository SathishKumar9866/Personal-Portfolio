// Run: node src/utils/llms-mirror.test.mjs [path-to-llms.txt]   (also `npm test`)
//
// `public/llms.txt` is a hand-written mirror of facts that live in
// `constants/index.js`. Hand-written was the right call — it is prose for a
// reader, not a dump — but hand-written also means it can quietly stop being
// true, and nothing checked that it had not.
//
// It had. The file listed Stack, Education, Projects and Contact and not one
// job, so every AI crawler reading this profile saw no employment history at
// all, for as long as the file has existed. This is the check that would have
// caught it on the day.
//
// ONE DIRECTION ONLY: everything in `constants` must appear in `llms.txt`. The
// reverse is allowed — the file's "Also" section lists repos the site does not
// show, deliberately.
//
// KNOWN LIMIT, stated rather than engineered around: the match is a substring,
// so a name that survives inside a longer one still passes. Renaming
// `pb-card-deck` to `pb-card-deck-OLD` in the FILE goes undetected; renaming it
// in `constants` does not, because the new name is then what has to be found.
// The direction that actually drifted historically is the one that is caught.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { contact, education, experience, projects, stackGroups } from "../constants/index.js";

// An argument lets the failure path be proved against a doctored copy without
// editing the real file. A check that has only ever passed is not yet a check.
const target = process.argv[2]
  ? pathToFileURL(process.argv[2])
  : new URL("../../public/llms.txt", import.meta.url);
const text = readFileSync(target, "utf8");

/**
 * Reports every missing item at once. Failing on the first one is how a drifted
 * file takes five runs to catch up.
 */
const mustContain = (label, values) => {
  const missing = values.filter((v) => !text.includes(v));
  assert.equal(
    missing.length,
    0,
    `${label} missing from llms.txt (${missing.length}): ${missing.join(" | ")}`
  );
};

const ROLES = experience.filter((e) => e.title);

const test_every_employer_is_listed = () =>
  mustContain("employers", ROLES.map((e) => e.company));

const test_every_role_title_is_listed = () =>
  mustContain("role titles", ROLES.map((e) => e.title));

const test_every_project_is_listed = () =>
  mustContain("projects", projects.map((p) => p.name));

const test_every_school_is_listed = () =>
  mustContain("schools", education.map((e) => e.school));

const test_every_stack_group_is_listed = () =>
  mustContain("stack groups", stackGroups.map((g) => g.title));

// The two tools each group leans on are the ones the file names explicitly.
const test_the_primary_tools_are_listed = () =>
  mustContain("primary tools", stackGroups.flatMap((g) => g.primary));

const test_the_email_is_listed = () => mustContain("contact", [contact.email]);

const tests = [
  test_every_employer_is_listed,
  test_every_role_title_is_listed,
  test_every_project_is_listed,
  test_every_school_is_listed,
  test_every_stack_group_is_listed,
  test_the_primary_tools_are_listed,
  test_the_email_is_listed,
];

let failed = 0;
for (const t of tests) {
  try {
    t();
    console.log(`ok   ${t.name}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${t.name}\n     ${e.message}`);
  }
}
console.log(`${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
