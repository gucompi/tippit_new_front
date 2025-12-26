import axios from 'axios';

// Get API key - server-side can use API_KEY, client-side needs NEXT_PUBLIC_API_KEY
function getApiKey(): string {
  if (typeof window === 'undefined') {
    // Server-side: prefer API_KEY (not exposed to client), fallback to NEXT_PUBLIC_API_KEY
    return process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || '';
  } else {
    // Client-side: only NEXT_PUBLIC_API_KEY is available
    return process.env.NEXT_PUBLIC_API_KEY || '';
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3003';
const API_KEY = getApiKey();

if (!API_KEY) {
  console.error('❌ API_KEY is not set in environment variables!');
  console.error('   Server-side: Set API_KEY in .env.local');
  console.error('   Client-side: Set NEXT_PUBLIC_API_KEY in .env.local');
  console.error('   Backend requests will fail with 401 Unauthorized');
}

export const backendClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API key to all requests via interceptor
backendClient.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
});

// Helper to add JWT token to requests
export const setAuthToken = (token: string) => {
  backendClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Helper to remove JWT token from requests
export const clearAuthToken = () => {
  delete backendClient.defaults.headers.common['Authorization'];
};

// Get token from localStorage if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
}

