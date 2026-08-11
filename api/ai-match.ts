import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS / Headers if needed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { userQuery, activities } = body || {};

    if (!userQuery || !Array.isArray(activities)) {
      return res.status(400).json({ error: 'Missing userQuery or activities array in request body' });
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

    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Error calling Gemini AI from serverless handler:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
