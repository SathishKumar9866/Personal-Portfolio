/* ---------------------------------------------------------------------------
   PLAIN ENGLISH, for anyone learning from this file.

   This is a tiny SEARCH ENGINE over the site's own words. No AI, no server.
   It splits the question into words, throws away the common ones, and scores
   every paragraph on the page by how many RARE words it shares with the
   question — "federated" tells you a lot, "data" tells you nothing. The best
   sentence of the best paragraph is the answer, quoted exactly.

   Three ideas do the work, and each fixed a real wrong answer:
     · IDF          — weight a word by how rare it is
     · length norm  — divide by paragraph length, or long ones win by accident
     · stemming     — chop endings so "ship" finds "Shipped"

   Walked through slowly: docs/LEARNING-NOTES.md, section 6.
--------------------------------------------------------------------------- */
/**
 * Owns: turning a typed question into passages that are already on this page.
 *
 * Does NOT own: writing sentences. Nothing here generates text. Every answer
 * this returns is a verbatim string from `../constants`, carrying the section
 * it lives in, because the hero claims "retrieval that cites the passage it
 * used" and a page making that claim should be able to do it. A generated
 * summary would also be the one thing this site never does: a sentence about
 * the work that nobody measured.
 *
 * The corpus is the same data the sections render, so it cannot go stale: add a
 * role or a project to `constants` and it is searchable in the same edit.
 */
import {
  contact,
  education,
  experience,
  projects,
  stackGroups,
  status,
} from "../constants/index.js";

const year = (iso) => (iso ? iso.slice(0, 4) : "");

// section = the anchor id to jump to; label = what the citation prints.
const DOCS = [
  {
    section: "about",
    label: "Open to work",
    title: `${status.role} at ${status.company}`,
    text: `Open to ${status.openTo}. ${status.country}: ${status.arrangement}. Based in ${contact.timezone}. Reach him at ${contact.email}.`,
  },
  ...experience.map((r) => ({
    section: "roles",
    label: r.company,
    title: `${r.title}, ${r.company}`,
    text: `${r.points.join(" ")} Worked in ${r.location}, ${year(r.start)} to ${
      r.current ? "present" : year(r.end)
    }. Tools: ${r.stack.join(", ")}.`,
  })),
  ...education.map((e) => ({
    section: "roles",
    label: e.school,
    title: e.degree,
    text: `${e.degree} at ${e.school}, ${e.location}, ${year(e.end)}.`,
  })),
  ...stackGroups.map((g) => ({
    section: "stack",
    label: g.title,
    title: g.title,
    text: `${g.note} Tools: ${g.items.join(", ")}. Leans on ${g.primary.join(" and ")}.`,
  })),
  ...projects.map((p) => ({
    section: "projects",
    label: p.name,
    title: p.name,
    text: `${p.outcome} ${p.description} Stages: ${p.stages.join(
      ", "
    )}. Tagged ${p.tags.join(", ")}.${p.live_link ? " This one is live." : ""}`,
  })),
];

// Question words and connectives carry no signal and, being in every document,
// would let "what does he do" match everything equally.
const STOP = new Set(
  ("a an and any are as at be but by can did do does for from has have he her him his how i in is it its me my "
    + "of on or she that the their them they this to was what when where which who whose why will with you your "
    + "tell show me about them us").split(" ")
);

/**
 * Three suffixes and a doubled consonant. Not linguistics — the rule only has
 * to be applied to the question and to the page identically, so "shipped" and
 * "ship" land on the same key even though neither is a real stem.
 *
 * It earns its place on one query. "what did he ship on Azure" used to answer
 * with a project that says "releases ship", above the role that says "Shipped a
 * production RAG application" and "Built the graph on Azure", because the role
 * matched only one of the two words.
 */
const fold = (w) => {
  let s = w;
  if (s.length > 4 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("ed")) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  // shipp -> ship, runn -> run
  const last = s[s.length - 1];
  if (s.length > 3 && last === s[s.length - 2] && !"aeiou".includes(last)) s = s.slice(0, -1);
  return s;
};

// What a reader asks with, spelled as the page spells it. Six entries, all of
// them words a recruiter types and this site never uses.
const ALIAS = {
  hire: "open", hiring: "open", job: "role", jobs: "role",
  available: "open", availability: "open",
};

const terms = (s) =>
  (s.toLowerCase().match(/[a-z0-9+#.]+/g) || [])
    .map((w) => ALIAS[w] || w)
    .map(fold)
    .filter((w) => w.length > 1 && !STOP.has(w));

// Document frequency, computed once: a term in every document (say "data")
// should not outweigh one in a single document ("federated").
const DF = new Map();
const INDEX = DOCS.map((d) => {
  const body = new Set(terms(d.text));
  const head = new Set(terms(d.title + " " + d.label));
  for (const t of new Set([...body, ...head])) DF.set(t, (DF.get(t) || 0) + 1);
  return { ...d, body, head };
});
const idf = (t) => Math.log(1 + DOCS.length / (1 + (DF.get(t) || 0)));

// Length normalisation, the one part of BM25 worth keeping here. Without it a
// long record wins every question simply by containing more words: "what did he
// ship on Azure" put a project that says "releases ship" above the role that
// says "Built the graph on Azure", because the project is three sentences long.
const AVG_LEN =
  INDEX.reduce((n, d) => n + d.body.size + d.head.size, 0) / (INDEX.length || 1);
const lengthNorm = (d) => 0.4 + 0.6 * ((d.body.size + d.head.size) / AVG_LEN);

// One sentence, not the whole record: the citation has to be short enough that
// a reader checks it rather than skips it.
const bestSentence = (text, qs) => {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  let best = parts[0] || text;
  let bestScore = -1;
  for (const p of parts) {
    const has = new Set(terms(p));
    const s = qs.reduce((n, t) => n + (has.has(t) ? idf(t) : 0), 0);
    if (s > bestScore) { bestScore = s; best = p; }
  }
  return best.trim();
};

/**
 * Passages on this page that match the question, best first.
 * Returns [] rather than a weak guess: a wrong citation is worse than none,
 * because the whole point of a citation is that it can be checked.
 */
export const ask = (query, limit = 3) => {
  const qs = [...new Set(terms(query))];
  if (qs.length === 0) return [];
  const scored = INDEX.map((d) => {
    // A title hit counts double. "pickleball" in a project's name is a stronger
    // signal about that project than the same word inside a paragraph.
    const score = qs.reduce(
      (n, t) => n + (d.body.has(t) ? idf(t) : 0) + (d.head.has(t) ? 2 * idf(t) : 0),
      0
    );
    return { score: score / lengthNorm(d), doc: d };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // Everything scores something once a common term is in the query, so cut
  // against the best hit rather than against a fixed number: a result under a
  // third of the top score is noise sitting under a real answer.
  const top = scored[0]?.score ?? 0;
  return scored
    .filter((r) => r.score >= top / 3)
    .slice(0, limit)
    .map(({ doc, score }) => ({
      section: doc.section,
      label: doc.label,
      title: doc.title,
      passage: bestSentence(doc.text, qs),
      score,
    }));
};

export const corpusSize = DOCS.length;
