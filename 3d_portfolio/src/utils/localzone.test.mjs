// Run: node src/utils/localzone.test.mjs   (also `npm test`)
//
// Named for the failures that matter: an offset that is right in July and wrong
// in January, and a delta printed with the wrong sign — both of which tell a
// reader in another country the wrong hour to expect a reply.
import assert from "node:assert/strict";
import { formatDelta, offsetMinutes, placeOf } from "./localzone.js";

const JAN = new Date("2026-01-15T12:00:00Z"); // US Central on standard time
const JUL = new Date("2026-07-15T12:00:00Z"); // US Central on daylight time

const test_offsets_follow_daylight_saving = () => {
  assert.equal(offsetMinutes("America/Chicago", JAN), -360); // CST, UTC-6
  assert.equal(offsetMinutes("America/Chicago", JUL), -300); // CDT, UTC-5
  assert.equal(offsetMinutes("UTC", JAN), 0);
};

// India keeps one offset all year. If this ever moves, the bug is here and not
// in the country.
const test_a_zone_without_dst_does_not_move = () => {
  assert.equal(offsetMinutes("Asia/Kolkata", JAN), 330);
  assert.equal(offsetMinutes("Asia/Kolkata", JUL), 330);
};

// The whole point of the readout: how far ahead the reader is. It changes by an
// hour across a US daylight-saving boundary, which is exactly the case a
// hardcoded "+10:30" would get wrong for four months of the year.
const test_the_delta_a_reader_actually_reads = () => {
  const jan = offsetMinutes("Asia/Kolkata", JAN) - offsetMinutes("America/Chicago", JAN);
  const jul = offsetMinutes("Asia/Kolkata", JUL) - offsetMinutes("America/Chicago", JUL);
  assert.equal(jan, 690); // +11:30h
  assert.equal(jul, 630); // +10:30h
  assert.equal(formatDelta(jan), "+11:30h");
  assert.equal(formatDelta(jul), "+10:30h");
};

const test_delta_formatting = () => {
  assert.equal(formatDelta(0), "same time");
  assert.equal(formatDelta(60), "+1h");
  assert.equal(formatDelta(-360), "−6h"); // a real minus sign, not a hyphen
  assert.equal(formatDelta(-345), "−5:45h"); // Chatham Islands, and it exists
};

const test_place_is_the_zone_not_an_address = () => {
  assert.equal(placeOf("Asia/Kolkata"), "Kolkata");
  assert.equal(placeOf("America/Argentina/Buenos_Aires"), "Buenos Aires");
  assert.equal(placeOf(""), "");
};

const tests = [
  test_offsets_follow_daylight_saving,
  test_a_zone_without_dst_does_not_move,
  test_the_delta_a_reader_actually_reads,
  test_delta_formatting,
  test_place_is_the_zone_not_an_address,
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
