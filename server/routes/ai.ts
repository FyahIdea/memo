import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const aiRouter = Router();

// Khởi tạo Gemini client (API key nằm trong env, không lộ ra frontend)
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// POST /api/ai/chat — Gửi prompt tới Gemini và trả về phản hồi
aiRouter.post('/chat', async (req: Request, res: Response) => {
  const { prompt, context } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Thiếu trường "prompt" trong request body' });
  }

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Kết hợp context (dữ liệu app) với prompt của user nếu có
    const fullPrompt = context
      ? `Context:\n${JSON.stringify(context, null, 2)}\n\nUser: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return res.json({ text });
  } catch (err: any) {
    console.error('Lỗi Gemini API:', err?.message || err);
    return res.status(500).json({ error: 'Lỗi khi gọi Gemini AI', detail: err?.message });
  }
});
