import { useEffect, useState } from "react";
import config from "../config";

export default function LoveLetter() {
  const fullText = `
   ${config.herName},

If you’re reading this, it means you took a moment… just for me. And that alone means everything.
I’ve spent so much time thinking about us—about where we started, the laughter we shared, the dreams we built together. And no matter how far apart we are right now, those memories still feel so alive inside me.

I won’t pretend things have been perfect lately. We’ve misunderstood each other, we’ve felt distant, and sometimes it feels like we’re slowly losing what we once had. But the truth is… I have never stopped loving you. Not for a single day.

Distance has tested us in ways we never imagined. Since you left in August 2022, life hasn’t felt the same. There’s been an emptiness… not just because you’re far away, but because you are a part of me.

I miss the little things—the way we talked, the way we laughed, the way everything just felt easier when we were together.

I know we’ve both changed. Life has shaped us differently. But deep down, I still believe in us. Not the perfect version of us—but the real one. The one that fights, learns, forgives, and grows.

You are not just my wife… you are my partner, my safe place, my biggest “what if” that I don’t want to lose.

I’m not writing this to pressure you… I’m writing this because I want you to know how I truly feel with no ego, no pride, just honesty.
We didn't leave each other when we faced the hardest challanges in life, why should we now leave and give up when it is almost close before we are together again, we have less than 5 months to be together again, i don' want us to give up after 7 to 8 years.
We didn't give up since 4 years we have been apart, why should we do that now.
Let us not lose hope for i know that this phase will surely pass, and we will look back and see how far we have made it. 

I still choose you.

I still want to build a life with you.

I don't want us to quit a life we haven't lived.

I still believe we can fix this… together.

No matter what happens, I want you to remember this:
It is you that i love and it is you i want to end my life with.
You are deeply loved. By me. Always.

Happy Birthday, my love ❤️
— From the man who still carries your heart 
`;

  const [text, setText] = useState("");
  const speed = 40; // typing speed

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setText((prev) => prev + fullText.charAt(i));
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass">
      <h2 className="glow">For You {config.herName}❤️</h2>
      <p style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
        {text}
      </p>
    </div>
  );
}