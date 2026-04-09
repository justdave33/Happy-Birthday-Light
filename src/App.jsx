import { useState } from "react";
import LockScreen from "./components/LockScreen";
import Intro from "./components/Intro";
import MainContent from "./MainContent";

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;
  if (!introDone) return <Intro onFinish={() => setIntroDone(true)} />;

  return <MainContent />;
}

export default App;