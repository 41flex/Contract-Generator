import { useState } from "react";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokens = await auth.login(email, password);
      // Salva o token ANTES de chamar auth.me() para que o header Authorization seja enviado
      localStorage.setItem("access_token", tokens.access_token);
      if (tokens.refresh_token)
        localStorage.setItem("refresh_token", tokens.refresh_token);
      const userData = await auth.me();
      login(tokens, userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <span className="logo-mark">FC</span>
        <span className="logo-text">Freela<strong>Contracts</strong></span>
      </div>
      <h1>Entrar</h1>
      <p className="auth-sub">Acesse seus contratos gerados por IA</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="auth-switch">
        Não tem conta?{" "}
        <button onClick={onSwitch} className="link-btn">Criar conta</button>
      </p>
    </div>
  );
}
