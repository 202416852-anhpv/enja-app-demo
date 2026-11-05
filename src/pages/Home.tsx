import { useState } from "react";
import InstallScreen from "./InstallScreen";
import LanguageSelect from "./LanguageSelect";

const INSTALL_SCREEN_SEEN_KEY = "enja:install-screen-seen";

function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function Home() {
  const [showInstallScreen, setShowInstallScreen] = useState(() => {
    if (isAppInstalled()) return false;
    return localStorage.getItem(INSTALL_SCREEN_SEEN_KEY) === null;
  });

  const finishInstallScreen = () => {
    localStorage.setItem(INSTALL_SCREEN_SEEN_KEY, "true");
    setShowInstallScreen(false);
  };

  if (showInstallScreen) {
    return <InstallScreen onDone={finishInstallScreen} />;
  }
  return <LanguageSelect />;
}
