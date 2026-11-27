// Torado Centralized API Config
// Defaults to the live production backend on Render, or VITE_API_URL if configured
export const API_BASE = (import.meta.env.VITE_API_URL || 'https://torado-ecommerce.onrender.com/api').replace(/\/+$/, '');
export default API_BASE;
