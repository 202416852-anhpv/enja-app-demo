import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadJpMeta } from "@/lib/jp/loaders";
import {
  JP_LEVELS,
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
  metaCount,
  type JpMeta,
} from "@/lib/jp/types";

export default function LevelSelect() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState<JpMeta | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadJpMeta()
      .then((value) => {
        if (!cancelled) setMeta(value);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quay lại"
          onClick={() => navigate("/")}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl">Học tiếng Nhật</h1>
          <p className="mt-1 text-muted-foreground">
            Chọn cấp độ JLPT của bạn.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {JP_LEVELS.map((level) => (
          <Card key={level}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{LEVEL_LABELS[level]}</CardTitle>
                <Badge variant="secondary">
                  {meta
                    ? `${metaCount(meta, "vocab", level)} từ · ${metaCount(meta, "kanji", level)} kanji · ${metaCount(meta, "grammar", level)} ngữ pháp`
                    : "Đang tải…"}
                </Badge>
              </div>
              <CardDescription>{LEVEL_DESCRIPTIONS[level]}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate(`/learn/ja/${level}`)}
              >
                Bắt đầu
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="text-center text-xs text-muted-foreground">
        Nguồn dữ liệu:{" "}
        <a
          href="https://github.com/evanclan/OpenJLPT"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          OpenJLPT
        </a>{" "}
        (CC BY-SA 4.0) ·{" "}
        {JP_LEVELS.map((level) => LEVEL_LABELS[level]).join(", ")}
      </footer>
    </main>
  );
}
