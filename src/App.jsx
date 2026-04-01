import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import LibraryPage from "./pages/LibraryPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  useEffect(() => {
    // Catch third-party errors (browser extensions, analytics, etc.) before they break the app
    const handleError = (event) => {
      if (
        event.message &&
        (event.message.includes("clearMarks") ||
          event.message.includes("mgt.") ||
          event.message.includes("third-party"))
      ) {
        event.preventDefault();
        console.warn("[Third-party error suppressed]:", event.message);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;