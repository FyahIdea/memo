import cors from 'cors';

// Cấu hình CORS cho phép frontend (Vite dev server) gọi backend
export const corsMiddleware = cors({
  origin: [
    'http://localhost:3000', // Vite dev server
    process.env.APP_URL || '', // Production URL từ .env
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
