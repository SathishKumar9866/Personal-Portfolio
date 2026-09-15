/* ---------------------------------------------------------------------------
   PLAIN ENGLISH.

   Works out where the reader is and how many hours apart the two of you are.
   The browser already knows its own timezone, so nothing here asks permission,
   looks up an IP, or sends a request anywhere.

   The fiddly part is the OFFSET. JavaScript will happily tell you the time in
   any zone, but not how far that zone is from UTC — so this formats the SAME
   instant twice, once in the zone and once in UTC, and subtracts. Doing it that
   way is automatically right across a daylight-saving boundary, which a
   hard-coded offset is not: India to US Central is +11:30h in January and
   +10:30h in July.

   (One ordinary English word in an earlier draft of this comment matched a
   Tailwind utility name, and Tailwind — which scans this file for class names,
   comments included — shipped a real CSS rule for it. The word is not repeated
   here for the same reason. Story: docs/LEARNING-NOTES.md, section 12.)

   Walked through slowly: docs/LEARNING-NOTES.md, section 8.
--------------------------------------------------------------------------- */
/**
 * Owns: what the visitor's own device says about where and when they are.
 *
 * Does NOT own: anything that leaves the machine. No geolocation prompt, no IP
 * lookup, no third-party service. `Intl.DateTimeFormat().resolvedOptions()` is
 * a setting the browser already exposes to every page, and reading it costs the
 * reader no permission dialog, no request, and no record anywhere.
 *
 * The one number worth deriving is the DIFFERENCE. A reader in Berlin does not
 * need to be told their own clock; they need to know that the person they are
 * about to email is seven hours behind them, which decides whether a reply
 * comes today.
 */

/**
 * A zone's offset from UTC, in minutes, at a given instant.
 *
 * Computed by formatting the same instant in the zone and in UTC and
 * subtracting, because there is no API that simply hands you the offset of an
 * arbitrary IANA zone — and doing it this way is automatically right across a
 * DST boundary rather than right for eight months of the year.
 */
export const offsetMinutes = (tz, at = new Date()) => {
  const read = (timeZone) => {
    const p = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(at);
    const v = (t) => Number(p.find((x) => x.type === t)?.value);
    // Date.UTC with the zone's own wall-clock values: the gap between the two
    // is the offset, with no parsing of a localised string anywhere.
    return Date.UTC(v("year"), v("month") - 1, v("day"), v("hour") % 24, v("minute"), v("second"));
  };
  return Math.round((read(tz) - read("UTC")) / 60000);
};

/** "+5:30", "-6", "0". The sign is the reader's, not ours: ahead is positive. */
export const formatDelta = (minutes) => {
  if (minutes === 0) return "same time";
  const sign = minutes > 0 ? "+" : "−"; // a real minus, not a hyphen
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}h`;
};

/** "Asia/Kolkata" -> "Kolkata". The zone id is the only place name a browser
 *  gives away, and it is a region, not an address. */
export const placeOf = (tz) => (tz || "").split("/").pop().replace(/_/g, " ");

/**
 * The visitor's zone, or null when the browser will not say. Null is a real
 * answer here and renders nothing: a clock labelled with a guessed zone is
 * worse than no clock, and the house rule is that unverified content does not
 * ship.
 */
export const visitorZone = (against) => {
  let tz;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
  if (!tz) return null;
  try {
    const delta = offsetMinutes(tz) - offsetMinutes(against);
    return { tz, place: placeOf(tz), delta, sameClock: delta === 0 };
  } catch {
    return null; // an unknown zone id throws inside Intl; say nothing
  }
};
