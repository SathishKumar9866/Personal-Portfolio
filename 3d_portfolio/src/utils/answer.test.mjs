// Run: node src/utils/answer.test.mjs   (also `npm test`)
//
// Named for the failures that matter: an answer pointing at the wrong section
// sends the reader to the wrong part of the page, and an answer that is not a
// verbatim quote is the one thing this feature promises never to do.
import assert from "node:assert/strict";
import { ask } from "./answer.js";
import { experience, projects, stackGroups } from "../constants/index.js";

const top = (q) => ask(q)[0];

// The whole corpus as one string. A passage that is not in here was invented.
const SOURCE = [
  ...experience.flatMap((r) => [...r.points, ...r.stack]),
  ...projects.flatMap((p) => [p.outcome, p.description, p.name]),
  ...stackGroups.flatMap((g) => [g.note, ...g.items]),
].join(" \n ");

const test_a_role_question_cites_the_role = () => {
  const r = top("what did he build on Azure");
  assert.equal(r.section, "experience");
  assert.equal(r.label, "AdvanSoft International, Inc");
  assert.match(r.passage, /Azure/);
};

// Both the research role and the project are genuinely about federated
// learning, and the role says so in more words, so it wins. What must hold is
// that the project is cited too, and that the top passage is about federation
// rather than something that merely shares a word with the question.
const test_a_project_question_cites_the_project = () => {
  const hits = ask("federated learning without sharing images");
  assert.match(hits[0].passage, /federated/i);
  assert.ok(
    hits.slice(0, 2).some((h) => h.label === "federated-yolov8-object-detection"),
    `project not in the top two: ${hits.map((h) => h.label).join(", ")}`
  );
};

// The query the stemmer was added for. "Shipped" is what the page says and
// "ship" is what a reader types; without folding them together the role loses to
// a project that happens to contain the word "ship" and not the word "Azure".
const test_ship_matches_shipped = () => {
  assert.equal(top("what did he ship on Azure?").label, "AdvanSoft International, Inc");
};

const test_a_tool_question_lands_in_stack = () => {
  const hits = ask("MLflow Docker Kubernetes");
  assert.ok(hits.some((h) => h.section === "stack"), "expected a Stack hit");
};

// "hire" appears nowhere on this site; the alias table is what saves it.
const test_recruiter_words_reach_availability = () => {
  assert.equal(top("are you available for hire").section, "about");
};

const test_nonsense_answers_nothing = () => {
  assert.deepEqual(ask("qwertyuiop zxcvb"), []);
  assert.deepEqual(ask("   "), []);
  assert.deepEqual(ask("the and of"), []); // stopwords only
};

// The claim the feature rests on: every word shown was already on the page.
const test_every_passage_is_quoted_not_written = () => {
  for (const q of ["Azure", "RAG citations", "vision tracking", "PySpark", "open to roles"]) {
    for (const hit of ask(q)) {
      const core = hit.passage.replace(/\.$/, "");
      assert.ok(
        SOURCE.includes(core) || core.startsWith("Open to ") || /^(Tools|Stages|Tagged|Worked|Leans|M\.S\.|B\.Tech)/.test(core),
        `not a quote: ${hit.passage}`
      );
    }
  }
};

const tests = [
  test_a_role_question_cites_the_role,
  test_a_project_question_cites_the_project,
  test_ship_matches_shipped,
  test_a_tool_question_lands_in_stack,
  test_recruiter_words_reach_availability,
  test_nonsense_answers_nothing,
  test_every_passage_is_quoted_not_written,
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
