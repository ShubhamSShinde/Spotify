import axios from 'axios';

// Use empty baseURL so requests go to /api/... on the same origin.
// Vite dev server proxies /api/* → http://localhost:3000 (see vite.config.js).
// This avoids CORS entirely in development — the browser never sees a cross-origin request.
// In production, deploy the frontend behind the same origin as the backend,
// or set VITE_API_URL to the backend URL and ensure CORS + SameSite=None are configured.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '',
  withCredentials: true, // still needed so cookies are sent through proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = (data) =>
  api.post('/api/auth/register', data);

export const loginUser = (data) =>
  api.post('/api/auth/login', data);

export const logoutUser = () =>
  api.post('/api/auth/logout');

// ─── Music (requires role: "user") ───────────────────────────────────────────
export const getAllMusic = () =>
  api.get('/api/music/');

export const getAllAlbums = () =>
  api.get('/api/music/albums');

export const getAlbumById = (albumId) =>
  api.get(`/api/music/albums/${albumId}`);

// ─── Music Upload (requires role: "artist") ──────────────────────────────────
export const uploadMusic = (formData) =>
  api.post('/api/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const createAlbum = (data) =>
  api.post('/api/music/create-album', data);

export default api;
