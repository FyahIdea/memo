import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { healthRouter } from './routes/health';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/ai', aiRouter);

// ─── Khởi động server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Memo Backend đang chạy tại http://localhost:${PORT}`);
});

export default app;
