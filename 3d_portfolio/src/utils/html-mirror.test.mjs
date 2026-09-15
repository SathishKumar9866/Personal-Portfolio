// Run: node src/utils/html-mirror.test.mjs   (also `npm test`)
//
// `index.html` carries TWO hand-written copies of facts that live in
// `constants/index.js`, and until this file neither was checked:
//
//   1. the JSON-LD block, which is what Google and every other structured-data
//      consumer reads — job title, schools, skills, contact links
//   2. the <noscript> block, which is what a crawler without JavaScript sees,
//      and the only content in the served HTML
//
// `llms-mirror.test.mjs` guards `public/llms.txt` the same way. That file was
// written first, and left these two unguarded — which is exactly the asymmetry
// that lets a fact rot in one place while looking correct everywhere else. The
// og:image had already gone stale that way: the tagline changed on the site and
// the card kept the old one for a day, because nothing could read it.
//
// SAME DIRECTION AS THE OTHER GUARD: everything in `constants` must appear in
// the HTML. The reverse is allowed — `knowsAbout` lists concepts like
// "Retrieval-Augmented Generation" that are not tool names in `constants`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contact, education, stackGroups, status } from "../constants/index.js";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

/** The JSON-LD is real JSON, so it gets parsed rather than string-matched: a
 *  trailing comma or a broken quote fails here instead of silently disabling
 *  the structured data in every crawler that reads it. */
const ld = (() => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, "no JSON-LD block found in index.html");
  return JSON.parse(m[1]);
})();

const noscript = (() => {
  const m = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
  assert.ok(m, "no <noscript> block found in index.html");
  return m[1];
})();

const missing = (label, values, haystack) => {
  const gone = values.filter((v) => !haystack.includes(v));
  assert.equal(gone.length, 0, `${label} missing (${gone.length}): ${gone.join(" | ")}`);
};

const test_the_json_ld_parses = () => {
  assert.equal(ld["@type"], "Person");
  assert.ok(ld.name && ld.url, "JSON-LD needs at least a name and a url");
};

// The title disagreed with itself once before: the LinkedIn header said
// "Machine Learning Engineer" while the site said "AI Engineer".
const test_the_job_title_matches_constants = () =>
  assert.equal(ld.jobTitle, status.role);

const test_the_email_matches_constants = () => {
  assert.equal(ld.email, `mailto:${contact.email}`);
  assert.ok(noscript.includes(contact.email), "the noscript block does not carry the email");
};

const test_every_school_is_in_alumniOf = () => {
  const names = (ld.alumniOf ?? []).map((a) => a.name);
  missing("schools in alumniOf", education.map((e) => e.school), names.join(" | "));
};

const test_every_social_link_is_in_sameAs = () => {
  const same = (ld.sameAs ?? []).join(" | ");
  missing("sameAs links", [contact.github, contact.linkedin.replace("in/", ""), "substack"], same);
};

// Not every tool — the primaries are the ones the file claims to list, and the
// ones a search engine has any use for.
const test_the_primary_tools_are_in_knowsAbout = () => {
  const knows = (ld.knowsAbout ?? []).join(" | ");
  const primaries = stackGroups.flatMap((g) => g.primary);
  const absent = primaries.filter((t) => !knows.includes(t));
  // A soft floor rather than all-or-nothing: knowsAbout is a summary, not an
  // inventory, and padding it with every tool would make it useless to a reader.
  assert.ok(
    absent.length <= 4,
    `knowsAbout has drifted: ${absent.length} of ${primaries.length} primary tools absent — ${absent.join(" | ")}`
  );
};

// The og:image cannot be tested — a PNG is opaque to every check in this repo —
// so the one thing that CAN be tested is that its source template still exists
// and still says what the site says.
const test_the_og_card_source_matches_the_role = () => {
  const card = readFileSync(new URL("../../docs/og-card.html", import.meta.url), "utf8");
  assert.ok(card.includes(status.role), `og-card.html no longer says "${status.role}"`);
};

const tests = [
  test_the_json_ld_parses,
  test_the_job_title_matches_constants,
  test_the_email_matches_constants,
  test_every_school_is_in_alumniOf,
  test_every_social_link_is_in_sameAs,
  test_the_primary_tools_are_in_knowsAbout,
  test_the_og_card_source_matches_the_role,
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
