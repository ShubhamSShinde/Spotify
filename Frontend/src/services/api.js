import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Send cookies with every request (JWT token)
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
