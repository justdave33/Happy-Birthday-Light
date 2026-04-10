import { useRef, useState } from "react";

export default function VoiceNote() {
  const audioRef = useRef(null);
  const [error, setError] = useState(false);

  return (
    <div className="glass">
      <h2>Listen to Me 💬</h2>

      {error ? (
        <p style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
          ⚠️ Voice note could not be loaded. Please make sure{" "}
          <code>birthday.m4a</code> is placed inside the{" "}
          <code>public/voice/</code> folder.
        </p>
      ) : (
        <audio
          ref={audioRef}
          controls
          style={{ width: "100%", marginTop: "0.5rem" }}
          onError={() => setError(true)}
        >
          {/* m4a is AAC audio — correct MIME types below */}
          <source src="/voice/birthday.m4a" type="audio/mp4" />
          <source src="/voice/birthday.m4a" type="audio/x-m4a" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}