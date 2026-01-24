import HomePage from './pages/home';

function App() {
  return (
    <div
      className="min-h-screen bg-[#FAFAFA] text-[#242424] antialiased"
      style={{
        fontFamily: '"Source Sans 3", "Inter", system-ui, -apple-system, sans-serif',
      }}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-[#555555] focus:bg-[#FAFAFA] focus:px-4 focus:py-2 focus:text-[0.875rem] focus:text-[#555555] focus:outline-none"
      >
        Skip to content
      </a>
      <main id="content">
        <HomePage />
      </main>
    </div>
  );
}

export default App;
