import { Router } from 'express';

export const healthRouter = Router();

// GET /api/health — Kiểm tra server đang chạy
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Memo Backend',
  });
});
