import type { JpFeature, JpLevel, JpMeta } from "./types";

const itemModules = import.meta.glob("../../data/jp/*/*.json");
const metaModules = import.meta.glob("../../data/jp/meta.json");

const cache = new Map<string, Promise<unknown>>();

function loadJson<T>(key: string, loader: () => Promise<unknown>): Promise<T> {
  if (!cache.has(key)) {
    cache.set(
      key,
      loader().then((mod) => (mod as { default: T }).default)
    );
  }
  return cache.get(key) as Promise<T>;
}

export function loadJpItems<T>(
  level: JpLevel,
  feature: JpFeature
): Promise<T[]> {
  const path = `../../data/jp/${feature}/${level}.json`;
  const loader = itemModules[path];
  if (!loader) {
    return Promise.reject(new Error(`Missing data: ${feature}/${level}`));
  }
  return loadJson<T[]>(`${feature}/${level}`, loader);
}

export function loadJpMeta(): Promise<JpMeta> {
  const loader = metaModules["../../data/jp/meta.json"];
  if (!loader) {
    return Promise.reject(new Error("Missing data: meta"));
  }
  return loadJson<JpMeta>("meta", loader);
}
