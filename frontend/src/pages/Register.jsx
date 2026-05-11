import { useState } from "react";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.register(form);
      const tokens = await auth.login(form.email, form.password);
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
      <h1>Criar conta</h1>
      <p className="auth-sub">Comece a gerar contratos profissionais</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="auth-switch">
        Já tem conta?{" "}
        <button onClick={onSwitch} className="link-btn">Entrar</button>
      </p>
    </div>
  );
}
