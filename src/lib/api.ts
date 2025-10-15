const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://artful-roots.onrender.com" || "http://localhost:4000";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function apiFetch<T = any>(path: string, options: { method?: HttpMethod; body?: any; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) => apiFetch<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: { email, password } }),
    register: (name: string, email: string, password: string, role: "artist" | "visitor") =>
      apiFetch<{ token: string; user: any }>("/api/auth/register", { method: "POST", body: { name, email, password, role } }),
  },
  artworks: {
    list: () => apiFetch<any[]>("/api/artworks"),
    create: (data: any) => apiFetch<any>("/api/artworks", { method: "POST", body: data, auth: true }),
    get: (id: string) => apiFetch<any>(`/api/artworks/${id}`),
    listComments: (id: string) => apiFetch<any[]>(`/api/artworks/${id}/comments`),
    addComment: (id: string, text: string) => apiFetch<any>(`/api/artworks/${id}/comments`, { method: "POST", body: { text }, auth: true }),
    deleteComment: (id: string, commentId: string) => apiFetch<any>(`/api/artworks/${id}/comments/${commentId}`, { method: "DELETE", auth: true })
  },
  exhibitions: {
    list: () => apiFetch<any[]>("/api/exhibitions"),
    create: (data: any) => apiFetch<any>("/api/exhibitions", { method: "POST", body: data, auth: true }),
  },
  artists: {
    list: () => apiFetch<any[]>("/api/artists"),
    get: (id: string) => apiFetch<any>(`/api/artists/${id}`),
  },
  profile: {
    get: () => apiFetch<any>("/api/profile", { auth: true }),
    update: (data: any) => apiFetch<any>("/api/profile", { method: "PUT", body: data, auth: true }),
  },
};

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}


