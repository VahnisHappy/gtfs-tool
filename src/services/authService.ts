const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  return response.json();
}

export function logout(): void {
  removeToken();
  window.location.hash = '#/login';
}