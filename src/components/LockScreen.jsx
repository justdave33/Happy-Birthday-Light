import { useState } from "react";

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");

  const correctPassword = "ikebe"; // change this

  const handleUnlock = () => {
    if (password.toLowerCase() === correctPassword) {
      onUnlock();
    } else {
      alert("Try again ❤️");
    }
  };

  return (
    <div className="intro">
      <h2>What do i call your backside? ❤️</h2>
      <input
        type="password"
        placeholder="Enter answer..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleUnlock}>Unlock</button>
    </div>
  );
}