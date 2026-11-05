import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LearnEnglish() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <Badge variant="secondary">Đang phát triển</Badge>
      <h1 className="text-4xl">Học tiếng Anh</h1>
      <p className="text-muted-foreground">
        Nội dung bài học tiếng Anh sẽ sớm có mặt tại đây.
      </p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Quay lại
      </Button>
    </main>
  );
}
