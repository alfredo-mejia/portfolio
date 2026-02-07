import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home.tsx";
import Story from "./pages/Story.tsx";
import Resume from "./pages/Resume.tsx";
import Blog from "./pages/Blog.tsx";
import Projects from "./pages/Projects.tsx";

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
  )
}

export default App
