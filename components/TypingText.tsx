"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
};

export function TypingText({
  texts,
  typingSpeed = 40,
  deletingSpeed = 30,
  pauseAfterType = 400,
  pauseAfterDelete = 400,
}: TypingTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[textIndex];

    if (!isDeleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterType);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      }, pauseAfterDelete);
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return (
    <span className="text-neutral-900 dark:text-white text-sm font-mono font-bold tracking-widest drop-shadow-sm">
      {displayed}
      <span className="ml-1 animate-blink text-sky-600 dark:text-sky-400">|</span>
    </span>
  );
}
