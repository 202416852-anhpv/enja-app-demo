export type JpLevel = "n5" | "n4" | "n3" | "n2" | "n1";
export type JpFeature = "kanji" | "vocab" | "grammar";

export const JP_LEVELS: JpLevel[] = ["n5", "n4", "n3", "n2", "n1"];
export const JP_FEATURES: JpFeature[] = ["kanji", "vocab", "grammar"];

export const LEVEL_LABELS: Record<JpLevel, string> = {
  n5: "N5",
  n4: "N4",
  n3: "N3",
  n2: "N2",
  n1: "N1",
};

export const LEVEL_DESCRIPTIONS: Record<JpLevel, string> = {
  n5: "Mới bắt đầu — nền tảng từ vựng, kanji và ngữ pháp hằng ngày.",
  n4: "Sơ cấp — mở rộng giao tiếp và đọc hiểu ở mức cơ bản.",
  n3: "Trung cấp — đọc tin tức và hội thoại nâng cao hơn.",
  n2: "Cao cấp — làm việc, học tập và thảo luận bằng tiếng Nhật.",
  n1: "Thượng cấp — văn bản phức tạp, biểu đạt tinh tế và trừu tượng.",
};

export const FEATURE_LABELS: Record<JpFeature, string> = {
  kanji: "Kanji",
  vocab: "Từ vựng",
  grammar: "Ngữ pháp",
};

export const FEATURE_DESCRIPTIONS: Record<JpFeature, string> = {
  kanji: "Chữ Hán: nghĩa, âm Hán/Huân, bộ thủ và từ ví dụ.",
  vocab: "Từ vựng: cách đọc, romaji, nghĩa và câu ví dụ.",
  grammar: "Ngữ pháp: mẫu câu, cách tạo thành và ví dụ minh họa.",
};

export interface JpVocabExample {
  ja: string;
  furigana: string;
  en: string;
  tatoeba_id?: number;
}

export interface JpVocab {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meanings: string[];
  level: string;
  pos?: string[];
  examples?: JpVocabExample[];
}

export interface JpKanji {
  character: string;
  level: string;
  strokes: number;
  grade?: number;
  freq?: number;
  radical?: string;
  radical_number?: number;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  nanori?: string[];
  words?: string[];
}

export interface JpGrammarExample {
  ja: string;
  furigana: string;
  en: string;
}

export interface JpGrammar {
  id: string;
  pattern: string;
  romaji: string;
  level: string;
  meaning: string;
  formation: string;
  examples?: JpGrammarExample[];
  tags?: string[];
  notes?: string;
}

export interface JpMeta {
  name: string;
  version: string;
  license: string;
  homepage: string;
  counts: Record<JpFeature, Record<string, number>>;
}

export function isJpLevel(value: string): value is JpLevel {
  return (JP_LEVELS as string[]).includes(value);
}

export function isJpFeature(value: string): value is JpFeature {
  return (JP_FEATURES as string[]).includes(value);
}

export function metaCount(
  meta: JpMeta | null,
  feature: JpFeature,
  level: JpLevel
): number {
  return meta?.counts?.[feature]?.[level.toUpperCase()] ?? 0;
}
