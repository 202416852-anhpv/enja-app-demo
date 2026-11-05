import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LanguageSelect() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl">Bạn muốn học ngôn ngữ nào?</h1>
        <p className="mt-2 text-muted-foreground">
          Chọn một ngôn ngữ để bắt đầu phiên học hôm nay.
        </p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🇬🇧 Tiếng Anh</CardTitle>
            <CardDescription>
              Luyện nghe, nói, đọc và từ vựng tiếng Anh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/learn/en")}>
              Bắt đầu
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🇯🇵 Tiếng Nhật</CardTitle>
            <CardDescription>
              Học từ vựng, kanji và giao tiếp tiếng Nhật.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/learn/ja")}>
              Bắt đầu
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
