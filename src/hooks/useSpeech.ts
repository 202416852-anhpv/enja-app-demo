export function useSpeech() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = (text: string, lang = "ja-JP") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) =>
        v.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))
      );
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return { supported, speak };
}
