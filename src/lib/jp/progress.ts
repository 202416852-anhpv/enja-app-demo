import type { JpFeature, JpLevel } from "./types";

function storageKey(level: JpLevel, feature: JpFeature, suffix: string) {
  return `enja:jp:${level}:${feature}:${suffix}`;
}

function readIds(level: JpLevel, feature: JpFeature): string[] {
  try {
    const raw = localStorage.getItem(storageKey(level, feature, "known"));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

function writeIds(level: JpLevel, feature: JpFeature, ids: string[]) {
  try {
    localStorage.setItem(
      storageKey(level, feature, "known"),
      JSON.stringify(ids)
    );
  } catch {
    return;
  }
}

export function getKnownIds(level: JpLevel, feature: JpFeature): string[] {
  return readIds(level, feature);
}

export function isKnown(level: JpLevel, feature: JpFeature, id: string) {
  return readIds(level, feature).includes(id);
}

export function toggleKnown(
  level: JpLevel,
  feature: JpFeature,
  id: string
): boolean {
  const ids = readIds(level, feature);
  const index = ids.indexOf(id);
  if (index >= 0) {
    ids.splice(index, 1);
    writeIds(level, feature, ids);
    return false;
  }
  ids.push(id);
  writeIds(level, feature, ids);
  return true;
}

export function getQuizBest(level: JpLevel, feature: JpFeature): number {
  try {
    const raw = localStorage.getItem(storageKey(level, feature, "quiz-best"));
    const value = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function saveQuizBest(
  level: JpLevel,
  feature: JpFeature,
  score: number
): number {
  const best = Math.max(getQuizBest(level, feature), score);
  try {
    localStorage.setItem(
      storageKey(level, feature, "quiz-best"),
      String(best)
    );
  } catch {
    return best;
  }
  return best;
}
