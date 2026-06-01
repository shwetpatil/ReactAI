import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import * as path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config({ path: '.env.local' });
console.log('GEMINI?', !!process.env.GEMINI_API_KEY);

const app = express();

// Initialize the multer upload middleware instance using memory storage
const upload = multer({ storage: multer.memoryStorage() });

const PORT = Number(process.env.PORT ?? 3333);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured.');
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

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

/**
 * PARSE RESUME ENDPOINT
 * Extracts full profile information matching frontend fields.
 */
app.post('/api/resume/parse', upload.single('resume'), async (req: Request, res: Response) => {
  console.log('Received resume parsing request');
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    // Convert file buffer to Gemini's inlineData inline payload structure
    const resumePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    // Explicit system instructions for rich document parsing
    const prompt = 'Extract candidate information from the attached resume document accurately into the requested schema template.';

    // Execute Gemini call requesting the expanded structural layout
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [resumePart, prompt],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Full name of the candidate.' },
            age: { type: Type.STRING, description: 'Age if mentioned, else empty string.' },
            phoneNumber: { type: Type.STRING, description: 'Primary contact number.' },
            email: { type: Type.STRING, description: 'Primary email address.' },
            linkedin: { type: Type.STRING, description: 'LinkedIn profile link if found, else empty.' },
            github: { type: Type.STRING, description: 'GitHub profile link if found, else empty.' },
            summary: { type: Type.STRING, description: 'Short professional profile summary bio.' },
            education: { type: Type.STRING, description: 'Educational institutions, degrees earned, and duration metrics.' },
            skills: { type: Type.STRING, description: 'Comma separated list summarizing relevant technological or tool skills.' },
            experience: { type: Type.STRING, description: 'Complete job timeline tracking roles, company locations, and descriptions.' },
          },
          required: ['name', 'email', 'phoneNumber', 'education', 'skills', 'experience'],
        },
      },
    });

    console.log(
      'Gemini Resume Parsing Response:',
      JSON.stringify(response, null, 2)
    );

    // Extract parsing results safely
    const responseText = response.text ?? '{}';
    const extractedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error('Parsing Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error during parsing',
    });
  }
});

app.post('/api/ai', async (req, res) => {
  try {
    const prompt = String(req.body?.prompt ?? '').trim();

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required.',
      });
    }

    const response = await ai.models.generateContent({
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
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start listening after all routes are declared
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
});

server.on('error', console.error);
