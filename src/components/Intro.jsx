import { useEffect } from "react";
import config from "../config";

export default function Intro({ onFinish }) {
  useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, 4000);
  }, []);

  return (
    <div className="intro">
      <h1 className="glow">For You, {config.herName}…</h1>
      <p style={{ opacity: 0.7 }}>
        Every moment with you still lives in me
      </p>
      
    </div>
  );
}