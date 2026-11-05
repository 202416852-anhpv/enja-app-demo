export interface RubyToken {
  text: string;
  ruby?: string;
}

const FURIGANA_PATTERN = /\{([^|{}]+)\|([^|{}]+)\}/g;

export function parseFurigana(input: string): RubyToken[] {
  const tokens: RubyToken[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(FURIGANA_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      tokens.push({ text: input.slice(lastIndex, start) });
    }
    tokens.push({ text: match[1], ruby: match[2] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < input.length) {
    tokens.push({ text: input.slice(lastIndex) });
  }
  return tokens;
}

export function stripFurigana(input: string): string {
  return parseFurigana(input)
    .map((token) => token.text)
    .join("");
}
