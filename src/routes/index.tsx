import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LearnEnglish from "../pages/LearnEnglish";
import LearnJapanese from "../pages/LearnJapanese";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn/en" element={<LearnEnglish />} />
      <Route path="/learn/ja" element={<LearnJapanese />} />
    </Routes>
  );
}
