import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function devAiApiPlugin(): Plugin {
  return {
    name: 'dev-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/ai-match' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const env = loadEnv(server.config.mode, process.cwd(), '');
              const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on dev server (.env.local)' }));
                return;
              }

              const body = JSON.parse(bodyStr || '{}');
              const { userQuery, activities } = body;

              if (!userQuery || !Array.isArray(activities)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing userQuery or activities' }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are an AI activity concierge for Moscow Activity Finder (Moscow City, Russia).
The user is looking for courses in Moscow: "${userQuery}"

Here is the JSON catalog of available Moscow activities:
${JSON.stringify(
  activities.map((a: any) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    subSkill: a.subSkill,
    audience: a.audience,
    metroStationName: a.metroStationName,
    metroLineName: a.metroLineName,
    walkMinutes: a.walkMinutes,
    price: a.price,
    priceFormatted: `${a.price?.toLocaleString('ru-RU')} ₽`,
    level: a.level,
    days: a.schedule?.days,
    timeOfDay: a.schedule?.timeOfDay,
    description: a.shortDescription,
  })),
  null,
  2
)}

Analyze the user's intent (schedule, Moscow metro location/line, interest, budget in ₽ Rubles, audience).
Return a JSON array of up to 4 best matching items. ONLY return valid raw JSON array without markdown formatting.
Each object must have:
- "activityId": string (matches catalog id)
- "matchPercentage": number between 70 and 99
- "reason": string (1-2 sentences explaining why this class matches the user's need in Moscow)
- "highlights": array of 2-3 short strings (e.g. ["Near Arbatskaya", "Under 2,500 ₽", "Beginner Friendly"])
`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
              });

              const text = response.text || '';
              const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(parsed));
            } catch (err: any) {
              console.error('Dev AI API error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal dev server error' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devAiApiPlugin()],
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
