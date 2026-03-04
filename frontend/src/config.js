// When deployed, this should point to your hosted backend URL.
// Since GitHub Pages is loaded over HTTPS, your backend MUST also be hosted on HTTPS to avoid Mixed Content errors.
// Currently falling back to your local server for local development.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
