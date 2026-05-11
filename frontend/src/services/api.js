const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  let token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Token expirado — tenta renovar automaticamente
  if (res.status === 401 && path !== "/auth/me") {
    const newToken = await refreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    } else {
      // Refresh também falhou — limpa sessão
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.reload();
      return;
    }
  }

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Erro na requisição");
  return data;
}

export const auth = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Credenciais inválidas");
      return data;
    });
  },

  me: () => request("/auth/me"),
};

export const contracts = {
  create: (body) =>
    request("/contracts/", { method: "POST", body: JSON.stringify(body) }),
  list: () => request("/contracts/"),
  get: (id) => request(`/contracts/${id}`),
  remove: (id) => request(`/contracts/${id}`, { method: "DELETE" }),
};
