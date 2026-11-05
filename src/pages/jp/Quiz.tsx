import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, Trophy, Volume2, X } from "lucide-react";
import Furigana from "@/components/Furigana";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressValue } from "@/components/ui/progress";
import { useSpeech } from "@/hooks/useSpeech";
import { loadJpItems } from "@/lib/jp/loaders";
import { getQuizBest, saveQuizBest } from "@/lib/jp/progress";
import {
  buildQuiz,
  type QuizQuestion,
} from "@/lib/jp/quiz";
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

type QuizItem = JpVocab | JpKanji | JpGrammar;

const CJK_PATTERN = /[\u3000-\u9fff\uff00-\uffef]/;

export default function Quiz() {
  const { level, feature } = useParams();
  const navigate = useNavigate();
  const speech = useSpeech();

  const valid =
    level !== undefined &&
    isJpLevel(level) &&
    feature !== undefined &&
    isJpFeature(feature);

  const [items, setItems] = useState<QuizItem[]>([]);
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = (data: QuizItem[], featureKey: JpFeature) => {
    setQuestions(buildQuiz(data, featureKey));
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    loadJpItems<QuizItem>(level, feature)
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setBest(getQuizBest(level, feature));
        startQuiz(data, feature);
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
        <p className="text-muted-foreground">Không tải được dữ liệu quiz.</p>
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

  const handleSelect = (optionIndex: number) => {
    if (selected !== null || finished) return;
    setSelected(optionIndex);
    if (optionIndex === questions[qIndex].answerIndex) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    const isLast = qIndex + 1 >= questions.length;
    setSelected(null);
    if (isLast) {
      setBest(saveQuizBest(jpLevel, jpFeature, score));
      setFinished(true);
      return;
    }
    setQIndex((value) => value + 1);
  };

  if (finished) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-10">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Trophy />
            </div>
            <CardTitle className="text-2xl">Hoàn thành!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-4xl tabular-nums">
              {score}/{questions.length}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              Kỷ lục: {best}/{questions.length}
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => startQuiz(items, jpFeature)}>
                <RotateCcw />
                Làm lại
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/learn/ja/${jpLevel}/${jpFeature}`)}
              >
                Quay lại bài học
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const question = questions[qIndex];
  const answered = selected !== null;
  const isCorrect = selected === question.answerIndex;
  const subjectIsJapanese = CJK_PATTERN.test(question.subject);
  const progressValue = ((qIndex + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quay lại"
          onClick={() => navigate(`/learn/ja/${jpLevel}/${jpFeature}`)}
        >
          <ArrowLeft />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl">Quiz {FEATURE_LABELS[jpFeature]}</h1>
            <Badge variant="secondary">{LEVEL_LABELS[jpLevel]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">
            Điểm: {score}/{questions.length}
          </p>
        </div>
      </header>

      <Progress value={progressValue}>
        <ProgressValue />
      </Progress>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <Badge variant="outline">
              Câu {qIndex + 1}/{questions.length}
            </Badge>
            <p className="text-muted-foreground">{question.question}</p>
            <div className="flex items-center gap-2">
              <span
                className={
                  question.subject.length > 18 ? "text-2xl" : "text-5xl"
                }
                lang={subjectIsJapanese ? "ja" : undefined}
              >
                {subjectIsJapanese ? (
                  <Furigana text={question.subject} />
                ) : (
                  question.subject
                )}
              </span>
              {question.speak && (
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Nghe phát âm"
                  disabled={!speech.supported}
                  onClick={() => speech.speak(question.speak as string)}
                >
                  <Volume2 />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            {question.options.map((option, optionIndex) => {
              const isAnswer = optionIndex === question.answerIndex;
              const isPicked = optionIndex === selected;
              let extra = "";
              if (answered && isAnswer) {
                extra =
                  "border-primary bg-primary text-primary-foreground hover:bg-primary/80";
              } else if (answered && isPicked) {
                extra =
                  "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20";
              } else if (answered) {
                extra = "opacity-50";
              }
              return (
                <Button
                  key={`${question.id}-${optionIndex}`}
                  variant="outline"
                  className={`h-auto justify-start px-4 py-3 text-left whitespace-normal ${extra}`}
                  disabled={answered}
                  onClick={() => handleSelect(optionIndex)}
                >
                  <span className="min-w-0 flex-1">{option}</span>
                  {answered && isAnswer && <Check />}
                  {answered && isPicked && !isAnswer && <X />}
                </Button>
              );
            })}
          </div>

          {answered && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                {isCorrect ? (
                  <Badge>
                    <Check />
                    Chính xác
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X />
                    Chưa đúng
                  </Badge>
                )}
                {!isCorrect && (
                  <span className="text-muted-foreground">
                    Đáp án: {question.options[question.answerIndex]}
                  </span>
                )}
              </div>
              <Button onClick={handleNext}>
                {qIndex + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
