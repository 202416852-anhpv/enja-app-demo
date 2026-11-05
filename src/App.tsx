import { BrowserRouter } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes";

export default function App() {
  useRegisterSW({
    onNeedReload() {
      toast.success("Đã cập nhật phiên bản mới");
      window.setTimeout(() => window.location.reload(), 1500);
    },
  });

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}
