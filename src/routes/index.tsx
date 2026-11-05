import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LearnEnglish from "../pages/LearnEnglish";
import LevelSelect from "../pages/jp/LevelSelect";
import FeatureMenu from "../pages/jp/FeatureMenu";
import Study from "../pages/jp/Study";
import Quiz from "../pages/jp/Quiz";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn/en" element={<LearnEnglish />} />
      <Route path="/learn/ja" element={<LevelSelect />} />
      <Route path="/learn/ja/:level" element={<FeatureMenu />} />
      <Route path="/learn/ja/:level/:feature" element={<Study />} />
      <Route path="/learn/ja/:level/:feature/quiz" element={<Quiz />} />
    </Routes>
  );
}
