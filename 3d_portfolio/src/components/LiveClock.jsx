import { useEffect, useMemo, useState } from "react";
import { formatDelta, visitorZone } from "../utils/localzone";

/**
 * Owns, the timezone readout in the hero rule and the footer colophon: his
 * three zones, plus the reader's own.
 *
 * The reader's zone comes from `Intl.DateTimeFormat().resolvedOptions()` — a
 * setting the browser already hands every page. No geolocation prompt, no IP
 * lookup, no request of any kind, and nothing recorded: see `utils/localzone`.
 * What it is FOR is the difference, not the time. A reader knows what their own
 * clock says; what decides whether they get a reply today is that the person
 * they are about to email is seven hours behind them.
 *
 * Zone abbreviations are DERIVED, never hardcoded. New York and Chicago are on
 * daylight time for about eight months a year, so a literal "EST"/"CST" is
 * wrong more often than it is right, and a US reader seeing "EST" beside a
 * correct EDT time reads it as an hour's error.
 */
const ZONES = [
  // His own zone leads: he is in US Central. The others are courtesy for a
  // reader elsewhere. These two shift with DST, so their labels are derived.
  { tz: "America/Chicago", full: "US Central time: where I am" },
  { tz: "America/New_York", full: "US Eastern time" },
  // India observes no DST, so a fixed label is correct year-round, and needed,
  // because Intl's short name for Asia/Kolkata in en-US is "GMT+5:30", not "IST".
  { tz: "Asia/Kolkata", full: "India Standard Time", label: "IST" },
];

const parts = (tz) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).formatToParts(new Date());

const read = ({ tz, label }) => {
  const p = parts(tz);
  const at = (t) => p.find((x) => x.type === t)?.value ?? "";
  return { time: `${at("hour")}:${at("minute")}`, zone: label ?? at("timeZoneName") };
};

const HOME = ZONES[0].tz; // his zone; every delta is measured against it

const LiveClock = ({ className = "" }) => {
  const [, tick] = useState(0);

  // Read once. A reader's zone changes only when they travel or edit a system
  // setting, neither of which happens between two minutes of one page view,
  // and the offset maths costs four Intl formats.
  const you = useMemo(() => visitorZone(HOME), []);
  // Already one of his three? Then the fourth block would print the same clock
  // twice. The entry is marked instead, which is the more interesting fact:
  // the reader is in the zone he works in.
  const mine = you && ZONES.findIndex((z) => z.tz === you.tz);

  // One timer, aligned to the minute boundary. The display's finest unit is the
  // minute, so a 20s interval was three times the work for a staler reading.
  useEffect(() => {
    let interval;
    const align = setTimeout(() => {
      tick((n) => n + 1);
      interval = setInterval(() => tick((n) => n + 1), 60000);
    }, 60000 - (Date.now() % 60000));
    return () => {
      clearTimeout(align);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {ZONES.map((z, i) => {
        const { time, zone } = read(z);
        return (
          <span key={z.tz}>
            {i > 0 && <span className="text-faint"> · </span>}
            {/* No aria-label on the wrapper, it would override the subtree and
                a screen reader would announce the label instead of the times. */}
            <abbr className="text-faint no-underline" title={z.full}>
              {zone}
            </abbr>{" "}
            <span>{time}</span>
            {mine === i && <span className="text-faint"> · yours</span>}
          </span>
        );
      })}
      {you && mine === -1 && (
        <span>
          <span className="text-faint"> · </span>
          <abbr
            className="text-faint no-underline"
            title={`Your device says ${you.tz}. That is ${
              you.sameClock ? "the same clock as" : `${formatDelta(you.delta)} from`
            } US Central, where he is.`}
          >
            YOU
          </abbr>{" "}
          <span>{read({ tz: you.tz }).time}</span>
          {!you.sameClock && (
            <span className="text-faint"> {formatDelta(you.delta)}</span>
          )}
        </span>
      )}
    </span>
  );
};

export default LiveClock;
