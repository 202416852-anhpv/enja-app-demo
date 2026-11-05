import type {
  JpFeature,
  JpGrammar,
  JpKanji,
  JpVocab,
} from "./types";

export const QUIZ_SIZE = 10;

export interface QuizQuestion {
  id: string;
  question: string;
  subject: string;
  options: string[];
  answerIndex: number;
  speak: string | null;
}

type Item = JpVocab | JpKanji | JpGrammar;

interface Draft {
  key: string;
  question: string;
  subject: string;
  answer: string;
  pool: string[];
  speak: string | null;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function vocabDrafts(items: JpVocab[], item: JpVocab, kind: number): Draft {
  const others = items.filter((x) => x.id !== item.id);
  if (kind === 0) {
    return {
      key: item.id,
      question: "Nghĩa của từ này là gì?",
      subject: item.word,
      answer: item.meanings.join(", "),
      pool: others.flatMap((x) => x.meanings),
      speak: item.word,
    };
  }
  return {
    key: item.id,
    question: "Từ này được đọc thế nào?",
    subject: item.word,
    answer: item.reading,
    pool: others.map((x) => x.reading),
    speak: null,
  };
}

function kanjiDrafts(items: JpKanji[], item: JpKanji, kind: number): Draft {
  const others = items.filter((x) => x.character !== item.character);
  if (kind === 0) {
    return {
      key: item.character,
      question: "Kanji này có nghĩa gì?",
      subject: item.character,
      answer: item.meanings.join(", "),
      pool: others.flatMap((x) => x.meanings),
      speak: item.character,
    };
  }
  const answer = item.onyomi[0] ?? item.kunyomi[0] ?? "";
  return {
    key: item.character,
    question: "Âm ON của kanji này là gì?",
    subject: item.character,
    answer,
    pool: others.flatMap((x) => [...x.onyomi, ...x.kunyomi]),
    speak: null,
  };
}

function grammarDrafts(items: JpGrammar[], item: JpGrammar, kind: number): Draft {
  const others = items.filter((x) => x.id !== item.id);
  if (kind === 0) {
    return {
      key: item.id,
      question: "Mẫu ngữ pháp này có nghĩa gì?",
      subject: item.pattern,
      answer: item.meaning,
      pool: others.map((x) => x.meaning),
      speak: item.pattern,
    };
  }
  return {
    key: item.id,
    question: "Mẫu ngữ pháp nào có nghĩa này?",
    subject: item.meaning,
    answer: item.pattern,
    pool: others.map((x) => x.pattern),
    speak: null,
  };
}

function toQuestion(draft: Draft): QuizQuestion {
  const distractors = shuffle([
    ...new Set(draft.pool.filter((v) => v && v !== draft.answer)),
  ]).slice(0, 3);
  const options = shuffle([draft.answer, ...distractors]);
  return {
    id: draft.key,
    question: draft.question,
    subject: draft.subject,
    options,
    answerIndex: options.indexOf(draft.answer),
    speak: draft.speak,
  };
}

export function buildQuiz(
  items: Item[],
  feature: JpFeature
): QuizQuestion[] {
  const picked = shuffle(items).slice(0, QUIZ_SIZE);
  return picked.map((item, index) => {
    const kind = index % 2;
    let draft: Draft;
    if (feature === "vocab") {
      draft = vocabDrafts(items as JpVocab[], item as JpVocab, kind);
    } else if (feature === "kanji") {
      draft = kanjiDrafts(items as JpKanji[], item as JpKanji, kind);
    } else {
      draft = grammarDrafts(items as JpGrammar[], item as JpGrammar, kind);
    }
    return toQuestion(draft);
  });
}
