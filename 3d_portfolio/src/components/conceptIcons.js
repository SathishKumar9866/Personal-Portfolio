/**
 * Owns: a mark for the terms that are ideas rather than products.
 *
 * Why these exist at all. Most tags on a project card — RAG, MLOps, Vision,
 * Federated, Applied ML — have no logo, because there is no company to have
 * one. With only the branded tools marked, a "built with" row of three showed
 * one glyph and two bare words, which reads as a missing image rather than as
 * a distinction.
 *
 * Why drawing these is NOT the thing the generator refuses to do. A brand mark
 * recalled from memory is a claim about someone else's identity and is either
 * right or wrong. These are category marks in the site's own line language, the
 * same vocabulary as the project covers and the career diagrams: a bounding box
 * for detection, a hub and three satellites for federated training, a cylinder
 * for SQL. They claim nothing about anyone.
 *
 * Kept deliberately primitive — lines, arcs and dots, 1.8px stroke, round caps
 * — because they render at about 14px beside a word. Anything with more detail
 * than this turns to grey mush at that size; that was measured on the branded
 * marks, where PostgreSQL's elephant is already at the limit.
 *
 * `s: 1` means "draw this as a stroke". The brand marks in `toolIcons.js` are
 * filled silhouettes, and the two cannot share a renderer without it.
 */
export const CONCEPT_ICONS = {
  // A page with a passage marked: the site's own claim about retrieval.
  RAG: { d: "M7 4h7l3 3v13H7z M14 4v3h3 M10 12h4 M10 15.5h2.5", s: 1 },
  // A prompt window and the three dots of a reply.
  LLM: { d: "M4 6h16v9h-9l-4 3.5V15H4z M9.5 10.5h.01 M12.5 10.5h.01 M15.5 10.5h.01", s: 1 },
  // The loop: train, ship, watch, train again.
  MLOps: { d: "M20 12a8 8 0 1 1-2.6-5.9 M20.5 3v4h-4", s: 1 },
  // Corner brackets and a target: what a detector draws on a frame.
  Vision: { d: "M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M12 12h.01", s: 1 },
  // A hub and three clients. Updates travel the spokes; the data never does.
  Federated: { d: "M12 12V6 M12 12l5.2 3 M12 12l-5.2 3 M12 5.2h.01 M17.6 15.2h.01 M6.4 15.2h.01", s: 1 },
  "Federated learning": { d: "M12 12V6 M12 12l5.2 3 M12 12l-5.2 3 M12 5.2h.01 M17.6 15.2h.01 M6.4 15.2h.01", s: 1 },
  // Two kinds of thing read as one: a square and a circle, overlapping.
  Multimodal: { d: "M3.5 6.5h9v9h-9z M15 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9", s: 1 },
  "Applied ML": { d: "M4 18.5l5-5 3.5 2.5 7-7.5 M4 18.5h.01", s: 1 },
  // A built thing, in one piece.
  Product: { d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5", s: 1 },
  // Something broadcasting right now.
  Live: { d: "M12 12h.01 M8.6 8.6a4.8 4.8 0 0 0 0 6.8 M15.4 8.6a4.8 4.8 0 0 1 0 6.8", s: 1 },
  // A vector: brackets around numbers, which is what an embedding is.
  // Nine loose dots were the first attempt and they disappeared at 14px —
  // 1.8px of ink nine times over is less ink than a single stroke.
  Embeddings: { d: "M8 4.5H5.5v15H8 M16 4.5h2.5v15H16 M10 9h.01 M13.5 12h.01 M10 15h.01", s: 1 },
  // Numbers you can compare, which is the whole point of the word.
  Evaluation: { d: "M5 19.5V12 M10 19.5V7.5 M15 19.5v-5 M20 19.5V5", s: 1 },
  // The cylinder every database diagram has used since about 1975.
  SQL: { d: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", s: 1 },
  // Out of one store, through a transform, into another.
  "ETL pipelines": { d: "M3 8.5h5v7H3z M16 8.5h5v7h-5z M9.5 12h5 M12.8 10l2 2-2 2", s: 1 },
  // A box on the thing, and the path it has taken.
  "Detection & tracking": { d: "M9.5 9.5h6v6h-6z M5 19.5c2.5-.6 4.2-1.8 5.5-3.4", s: 1 },
  // Looking before concluding.
  "Exploratory analysis": { d: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15.4 15.4L20 20 M9 11h.01 M12.5 9.5h.01", s: 1 },
};
