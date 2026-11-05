import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { Progress, ProgressValue } from "@/components/ui/progress";
import { loadJpMeta } from "@/lib/jp/loaders";
import { getKnownIds } from "@/lib/jp/progress";
import {
  FEATURE_DESCRIPTIONS,
  FEATURE_LABELS,
  JP_FEATURES,
  LEVEL_LABELS,
  isJpLevel,
  metaCount,
  type JpMeta,
} from "@/lib/jp/types";

export default function FeatureMenu() {
  const { level } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<JpMeta | null>(null);

  const validLevel = level !== undefined && isJpLevel(level);

  const [knownCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    if (validLevel) {
      for (const feature of JP_FEATURES) {
        counts[feature] = getKnownIds(level, feature).length;
      }
    }
    return counts;
  });

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

  const totals = useMemo(() => {
    if (!meta || !validLevel) return null;
    const values: Record<string, number> = {};
    for (const feature of JP_FEATURES) {
      values[feature] = metaCount(meta, feature, level);
    }
    return values;
  }, [meta, validLevel, level]);

  if (!validLevel) {
    return <Navigate to="/learn/ja" replace />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quay lại"
          onClick={() => navigate("/learn/ja")}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl">Cấp {LEVEL_LABELS[level]}</h1>
          <p className="mt-1 text-muted-foreground">
            Chọn nội dung bạn muốn học.
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        {JP_FEATURES.map((feature) => {
          const total = totals?.[feature] ?? 0;
          const known = knownCounts[feature] ?? 0;
          const percent = total > 0 ? (known / total) * 100 : 0;
          return (
            <Card key={feature}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {FEATURE_LABELS[feature]}
                  </CardTitle>
                  <Badge variant="secondary">
                    {total > 0 ? `${known}/${total}` : "…"}
                  </Badge>
                </div>
                <CardDescription>
                  {FEATURE_DESCRIPTIONS[feature]}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Progress value={percent}>
                  <ProgressValue />
                </Progress>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/learn/ja/${level}/${feature}`)}
                >
                  Học {FEATURE_LABELS[feature]}
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
        (CC BY-SA 4.0)
      </footer>
    </main>
  );
}
