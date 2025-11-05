import React, { useEffect, useState } from "react";

const Typewriter = ({ staticPart, typewriterPart, typingSpeed, typingPause, eraseSpeed, erasePause }) => {
  const [typewriterText, setTypewriterText] = useState("");

  useEffect(() => {
    let index = 0;
    let isTyping = true;

    const typeWriter = () => {
      if (isTyping) {
        if (index < typewriterPart.length) {
          setTypewriterText(typewriterPart.substring(0, index + 1));
          index++;
          setTimeout(typeWriter, typingSpeed);
        } else {
          setTimeout(() => {
            isTyping = false;
            index = typewriterPart.length;
            typeWriter();
          }, typingPause);
        }
      } else {
        if (index > 0) {
          setTypewriterText(typewriterPart.substring(0, index - 1));
          index--;
          setTimeout(typeWriter, eraseSpeed);
        } else {
          setTimeout(() => {
            isTyping = true;
            typeWriter();
          }, erasePause);
        }
      }
    };

    typeWriter();

    return () => {
      setTypewriterText("");
    };
  }, [typewriterPart, typingSpeed, typingPause, eraseSpeed, erasePause]);

  return (
    <span className="typewriter">{staticPart}{typewriterText}</span>
  );
};

export default Typewriter;
