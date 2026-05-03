import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PublicFeed from "./pages/PublicFeed";
import RecipePage from "./pages/RecipePage";
import Register from "./pages/Register";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (authLoading) {
    return <div className="app-shell centered-state">Loading CookSphere...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar apiBaseUrl={API_BASE_URL} user={user} setUser={setUser} />
        <main className="page-container">
          <Routes>
            <Route
              path="/"
              element={<PublicFeed apiBaseUrl={API_BASE_URL} user={user} />}
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login apiBaseUrl={API_BASE_URL} setUser={setUser} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register apiBaseUrl={API_BASE_URL} setUser={setUser} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard apiBaseUrl={API_BASE_URL} user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/recipes/:id"
              element={<RecipePage apiBaseUrl={API_BASE_URL} user={user} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
