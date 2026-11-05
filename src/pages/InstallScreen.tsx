import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

type InstallScreenProps = {
  onDone: () => void;
};

export default function InstallScreen({ onDone }: InstallScreenProps) {
  const installPrompt = useInstallPrompt();

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      onDone();
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <img src="/favicon.svg" alt="EnJa App" className="mb-3 size-12" />
          <CardTitle className="text-2xl">Cài đặt EnJa App</CardTitle>
          <CardDescription>
            Thêm ứng dụng vào màn hình chính để mở nhanh như một ứng dụng thật.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {installPrompt && (
            <Button onClick={handleInstall}>
              <Download />
              Cài đặt ứng dụng
            </Button>
          )}
          <Button variant="ghost" onClick={onDone}>
            Để sau
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
