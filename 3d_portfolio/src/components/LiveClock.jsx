import { useEffect, useState } from "react";

/**
 * Owns: the three-timezone readout in the hero rule and the footer colophon.
 *
 * Zone abbreviations are DERIVED, never hardcoded. New York and Chicago are on
 * daylight time for about eight months a year, so a literal "EST"/"CST" is
 * wrong more often than it is right — and a US reader seeing "EST" beside a
 * correct EDT time reads it as an hour's error.
 */
const ZONES = [
  // India observes no DST, so a fixed label is correct year-round — and needed,
  // because Intl's short name for Asia/Kolkata in en-US is "GMT+5:30", not "IST".
  { tz: "Asia/Kolkata", full: "India Standard Time", label: "IST" },
  // These two DO shift, so their labels are derived rather than hardcoded.
  { tz: "America/New_York", full: "US Eastern time" },
  { tz: "America/Chicago", full: "US Central time" },
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

const LiveClock = ({ className = "" }) => {
  const [, tick] = useState(0);

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
            {/* No aria-label on the wrapper: it would override the subtree and
                a screen reader would announce the label instead of the times. */}
            <abbr className="text-faint no-underline" title={z.full}>
              {zone}
            </abbr>{" "}
            <span>{time}</span>
          </span>
        );
      })}
    </span>
  );
};

export default LiveClock;
