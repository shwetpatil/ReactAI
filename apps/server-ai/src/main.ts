import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();

const PORT = Number(process.env.PORT ?? 3333);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY is not configured.'
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

app.use(
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    res.header(
      'Access-Control-Allow-Origin',
      '*'
    );

    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );

    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,OPTIONS'
    );

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  }
);

app.use(express.json());

app.use(
  '/assets',
  express.static(path.join(__dirname, 'assets'))
);

app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to server-ai!',
  });
});

app.post('/api/ai', async (req, res) => {
  try {
    const prompt = String(req.body?.prompt ?? '').trim();

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required.',
      });
    }

    const response =
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

    console.log(
      'Gemini Response:',
      JSON.stringify(response, null, 2)
    );

    return res.json({
      text: response.text ?? '',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(
    `Listening at http://localhost:${PORT}/api`
  );
});

server.on('error', console.error);