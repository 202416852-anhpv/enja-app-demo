import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Volume2,
} from "lucide-react";
import Furigana from "@/components/Furigana";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress, ProgressValue } from "@/components/ui/progress";
import { useSpeech } from "@/hooks/useSpeech";
import { stripFurigana } from "@/lib/jp/furigana";
import { loadJpItems } from "@/lib/jp/loaders";
import { getKnownIds, toggleKnown } from "@/lib/jp/progress";
import {
  FEATURE_LABELS,
  LEVEL_LABELS,
  isJpFeature,
  isJpLevel,
  type JpFeature,
  type JpGrammar,
  type JpKanji,
  type JpLevel,
  type JpVocab,
} from "@/lib/jp/types";

type StudyItem = JpVocab | JpKanji | JpGrammar;

function itemId(item: StudyItem, feature: JpFeature): string {
  if (feature === "kanji") return (item as JpKanji).character;
  if (feature === "vocab") return (item as JpVocab).id;
  return (item as JpGrammar).id;
}

function frontText(item: StudyItem, feature: JpFeature): string {
  if (feature === "kanji") return (item as JpKanji).character;
  if (feature === "vocab") return (item as JpVocab).word;
  return (item as JpGrammar).pattern;
}

function ExampleBlock({
  ja,
  furigana,
  en,
  onSpeak,
}: {
  ja: string;
  furigana?: string;
  en?: string;
  onSpeak: (text: string) => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-left">
      <div className="min-w-0 flex-1">
        <div className="text-base leading-relaxed">
          <Furigana text={furigana || ja} />
        </div>
        {en && <div className="mt-0.5 text-sm text-muted-foreground">{en}</div>}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Nghe phát âm"
        onClick={() => onSpeak(stripFurigana(furigana || ja))}
      >
        <Volume2 />
      </Button>
    </div>
  );
}

export default function Study() {
  const { level, feature } = useParams();
  const navigate = useNavigate();
  const speech = useSpeech();

  const valid =
    level !== undefined &&
    isJpLevel(level) &&
    feature !== undefined &&
    isJpFeature(feature);

  const [items, setItems] = useState<StudyItem[]>([]);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    loadJpItems<StudyItem>(level, feature)
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setIndex(0);
        setFlipped(false);
        setKnown(new Set(getKnownIds(level, feature)));
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [level, feature, valid]);

  if (!valid) {
    return <Navigate to="/learn/ja" replace />;
  }

  const jpLevel = level as JpLevel;
  const jpFeature = feature as JpFeature;

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Không tải được dữ liệu bài học.</p>
        <Button
          variant="outline"
          onClick={() => navigate(`/learn/ja/${jpLevel}`)}
        >
          Quay lại
        </Button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-muted-foreground">Đang tải dữ liệu…</p>
      </main>
    );
  }

  const current = items[Math.min(index, items.length - 1)];
  const currentId = itemId(current, jpFeature);
  const isCurrentKnown = known.has(currentId);
  const knownCount = known.size;
  const percent = (knownCount / items.length) * 100;

  const handleToggleKnown = () => {
    const next = toggleKnown(jpLevel, jpFeature, currentId);
    setKnown((prev) => {
      const updated = new Set(prev);
      if (next) updated.add(currentId);
      else updated.delete(currentId);
      return updated;
    });
  };

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setFlipped(false);
  };

  const renderFront = () => {
    if (jpFeature === "kanji") {
      const kanji = current as JpKanji;
      return (
        <>
          <div className="text-7xl leading-none" lang="ja">
            {kanji.character}
          </div>
          <div className="text-sm text-muted-foreground">
            {kanji.strokes} nét · Bộ thủ {kanji.radical ?? "—"}
          </div>
        </>
      );
    }
    if (jpFeature === "vocab") {
      const vocab = current as JpVocab;
      return (
        <>
          <div className="text-5xl" lang="ja">
            {vocab.word}
          </div>
          <div className="text-sm text-muted-foreground">
            Bấm để xem đáp án
          </div>
        </>
      );
    }
    const grammar = current as JpGrammar;
    return (
      <>
        <div className="text-4xl" lang="ja">
          {grammar.pattern}
        </div>
        <div className="text-sm text-muted-foreground">{grammar.romaji}</div>
      </>
    );
  };

  const renderBack = () => {
    if (jpFeature === "kanji") {
      const kanji = current as JpKanji;
      return (
        <div className="flex flex-col gap-3 text-left">
          <div className="text-lg">{kanji.meanings.join(" · ")}</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary px-3 py-2">
              <div className="text-muted-foreground">Âm ON</div>
              <div lang="ja">{kanji.onyomi.join("、") || "—"}</div>
            </div>
            <div className="rounded-lg bg-secondary px-3 py-2">
              <div className="text-muted-foreground">Âm KUN</div>
              <div lang="ja">{kanji.kunyomi.join("、") || "—"}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Bộ thủ {kanji.radical ?? "—"}
            {kanji.radical_number ? ` (số ${kanji.radical_number})` : ""} ·{" "}
            {kanji.strokes} nét
          </div>
          {kanji.words && kanji.words.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {kanji.words.slice(0, 6).map((word) => (
                <Badge key={word} variant="secondary" lang="ja">
                  {word}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (jpFeature === "vocab") {
      const vocab = current as JpVocab;
      return (
        <div className="flex flex-col gap-3 text-left">
          <div>
            <div className="text-2xl" lang="ja">
              {vocab.reading}
            </div>
            <div className="text-sm text-muted-foreground">{vocab.romaji}</div>
          </div>
          <div className="text-lg">{vocab.meanings.join(" · ")}</div>
          {vocab.examples && vocab.examples.length > 0 && (
            <div className="flex flex-col gap-2">
              {vocab.examples.slice(0, 2).map((example) => (
                <ExampleBlock
                  key={example.ja}
                  ja={example.ja}
                  furigana={example.furigana}
                  en={example.en}
                  onSpeak={speech.speak}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    const grammar = current as JpGrammar;
    return (
      <div className="flex flex-col gap-3 text-left">
        <div className="text-lg">{grammar.meaning}</div>
        <div className="text-sm">
          <span className="text-muted-foreground">Cách tạo thành: </span>
          <span lang="ja">{grammar.formation}</span>
        </div>
        {grammar.notes && (
          <p className="text-sm text-muted-foreground">{grammar.notes}</p>
        )}
        {grammar.examples && grammar.examples.length > 0 && (
          <div className="flex flex-col gap-2">
            {grammar.examples.slice(0, 2).map((example) => (
              <ExampleBlock
                key={example.ja}
                ja={example.ja}
                furigana={example.furigana}
                en={example.en}
                onSpeak={speech.speak}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quay lại"
          onClick={() => navigate(`/learn/ja/${jpLevel}`)}
        >
          <ArrowLeft />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl">
              {FEATURE_LABELS[jpFeature]}
            </h1>
            <Badge variant="secondary">{LEVEL_LABELS[jpLevel]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">
            {knownCount}/{items.length} đã biết
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/learn/ja/${jpLevel}/${jpFeature}/quiz`)
          }
        >
          Làm quiz
        </Button>
      </header>

      <Progress value={percent}>
        <ProgressValue />
      </Progress>

      <Card className="p-0">
        <button
          type="button"
          className="flex min-h-64 w-full cursor-pointer flex-col items-center justify-center gap-3 px-6 py-12 text-center transition-colors hover:bg-accent/40"
          onClick={() => setFlipped((value) => !value)}
        >
          {flipped ? renderBack() : renderFront()}
        </button>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={!speech.supported}
          onClick={() => speech.speak(frontText(current, jpFeature))}
        >
          <Volume2 />
          Phát
        </Button>
        <Button variant="outline" onClick={() => setFlipped((v) => !v)}>
          <RotateCcw />
          {flipped ? "Xem mặt trước" : "Lật thẻ"}
        </Button>
        <Button
          variant={isCurrentKnown ? "secondary" : "default"}
          onClick={handleToggleKnown}
        >
          <Check />
          {isCurrentKnown ? "Đã biết" : "Đánh dấu đã biết"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Thẻ trước"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          <ArrowLeft />
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums">
          {index + 1}/{items.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Thẻ tiếp theo"
          disabled={index >= items.length - 1}
          onClick={() => goTo(index + 1)}
        >
          <ArrowRight />
        </Button>
      </div>
    </main>
  );
}
