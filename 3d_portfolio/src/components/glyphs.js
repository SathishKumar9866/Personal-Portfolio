/**
 * The one module TagTerm imports lazily: brand marks and category marks
 * together, so a chip asks once and gets whichever kind its term has.
 *
 * Two files behind it because they are maintained differently. `toolIcons.js`
 * is generated from simple-icons and must never be hand-edited; `conceptIcons.js`
 * is hand-drawn and has no generator. Splitting them keeps `npm run icons` from
 * ever overwriting the drawn set.
 */
export { TOOL_ICONS } from "./toolIcons";
export { CONCEPT_ICONS } from "./conceptIcons";
