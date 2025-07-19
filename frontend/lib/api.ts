import { Chirp } from "@/types/chirp";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function register(data: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function login(data: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function fetchChirps(): Promise<Chirp[]>  {
  const res = await fetch(`${API_URL}/chirps`);
  return res.json();
}

export async function postChirp(content: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/chirps`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to post chirp');
  return res.json();
}
