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

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to server-ai!',
  });
});

/**
 * PARSE RESUME ENDPOINT
 * Extracts full profile information matching frontend fields.
 */
app.post(
  '/api/resume/parse',
  upload.single('resume'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No resume uploaded',
        });
      }

      const resumePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };

      const prompt = `
You are an expert resume parser.

Analyze the attached resume and extract information.

Rules:
- Return ONLY the schema fields.
- If information is missing, return empty string or empty array.
- Preserve company names exactly.
- Preserve job titles exactly.
- Extract all education entries.
- Extract all work experiences.
- Extract all skills.
- Do not hallucinate missing information.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',

        contents: [resumePart, prompt],

        config: {
          responseMimeType: 'application/json',

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              name: {
                type: Type.STRING,
              },

              email: {
                type: Type.STRING,
              },

              phoneNumber: {
                type: Type.STRING,
              },

              linkedin: {
                type: Type.STRING,
              },

              github: {
                type: Type.STRING,
              },

              location: {
                type: Type.STRING,
              },

              currentDesignation: {
                type: Type.STRING,
              },

              totalExperience: {
                type: Type.STRING,
              },

              summary: {
                type: Type.STRING,
              },

              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },

              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: {
                      type: Type.STRING,
                    },
                    degree: {
                      type: Type.STRING,
                    },
                    year: {
                      type: Type.STRING,
                    },
                  },
                },
              },

              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: {
                      type: Type.STRING,
                    },
                    role: {
                      type: Type.STRING,
                    },
                    startDate: {
                      type: Type.STRING,
                    },
                    endDate: {
                      type: Type.STRING,
                    },
                    description: {
                      type: Type.STRING,
                    },
                  },
                },
              },
            },

            required: [
              'name',
              'email',
              'phoneNumber',
              'skills',
              'education',
              'experience',
            ],
          },
        },
      });

      const responseText = response.text ?? '{}';

      let parsedData = {};

      try {
        parsedData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON Parse Error', jsonError);

        return res.status(500).json({
          success: false,
          error: 'Gemini returned invalid JSON',
        });
      }

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (error) {
      console.error('Resume Parse Error', error);

      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

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

    console.log('Gemini Response:', JSON.stringify(response, null, 2));

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
