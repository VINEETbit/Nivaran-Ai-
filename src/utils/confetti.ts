import confetti from "canvas-confetti";

export function safeConfetti(options?: any) {
  try {
    if (typeof confetti === "function") {
      confetti(options);
    } else if (confetti && typeof (confetti as any).default === "function") {
      (confetti as any).default(options);
    } else {
      const winConfetti = (window as any).confetti;
      if (typeof winConfetti === "function") {
        winConfetti(options);
      }
    }
  } catch (error) {
    console.warn("Confetti animation failed to execute:", error);
  }
}
