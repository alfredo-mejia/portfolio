import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Story from "./pages/Story";
import Resume from "./pages/Resume";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
