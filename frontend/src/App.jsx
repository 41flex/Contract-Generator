import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import "./App.css";

function AppContent() {
  const { user, loading } = useAuth();
  const [authPage, setAuthPage] = useState("login");

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-bg" />
        {authPage === "login" ? (
          <Login onSwitch={() => setAuthPage("register")} />
        ) : (
          <Register onSwitch={() => setAuthPage("login")} />
        )}
      </div>
    );
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
