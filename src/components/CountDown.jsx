import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2026-06-01");
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate - new Date();

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass">
      <h2>Until I See You Again ⏳</h2>
      <p>{timeLeft.days} days, {timeLeft.hours} hours</p>
    </div>
  );
}