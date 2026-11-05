import { parseFurigana } from "@/lib/jp/furigana";

type FuriganaProps = {
  text: string;
};

export default function Furigana({ text }: FuriganaProps) {
  const tokens = parseFurigana(text);
  return (
    <span lang="ja">
      {tokens.map((token, index) =>
        token.ruby ? (
          <ruby key={index}>
            {token.text}
            <rt>{token.ruby}</rt>
          </ruby>
        ) : (
          <span key={index}>{token.text}</span>
        )
      )}
    </span>
  );
}
