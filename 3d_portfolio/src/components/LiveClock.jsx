import { useEffect, useState } from "react";

const ZONES = [
  { label: "IST", tz: "Asia/Kolkata" },
  { label: "EST", tz: "America/New_York" },
  { label: "CST", tz: "America/Chicago" },
];

const timeIn = (tz) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const LiveClock = ({ className = "" }) => {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`} aria-label="Current local times">
      {ZONES.map((z, i) => (
        <span key={z.label}>
          {i > 0 && <span className="text-faint"> · </span>}
          <span className="text-faint">{z.label}</span>{" "}
          <span>{timeIn(z.tz)}</span>
        </span>
      ))}
    </span>
  );
};

export default LiveClock;
