import { GoogleGenAI } from '@google/genai';
import { Activity, AiMatchResult } from '../types';

export async function findAiMatches(
  userQuery: string,
  activities: Activity[]
): Promise<AiMatchResult[]> {
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an AI activity concierge for Moscow Activity Finder (Moscow City, Russia).
The user is looking for courses in Moscow: "${userQuery}"

Here is the JSON catalog of available Moscow activities:
${JSON.stringify(
  activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    subSkill: a.subSkill,
    audience: a.audience,
    metroStationName: a.metroStationName,
    metroLineName: a.metroLineName,
    walkMinutes: a.walkMinutes,
    price: a.price,
    priceFormatted: `${a.price.toLocaleString('ru-RU')} ₽`,
    level: a.level,
    days: a.schedule.days,
    timeOfDay: a.schedule.timeOfDay,
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local matcher:', err);
    }
  }

  // Fallback intelligent matching engine if API key is not present or call fails
  return fallbackSmartMatch(userQuery, activities);
}

function fallbackSmartMatch(userQuery: string, activities: Activity[]): AiMatchResult[] {
  const queryLower = userQuery.toLowerCase();

  const scored = activities.map((act) => {
    let score = 75;
    const highlights: string[] = [];

    // Category / Keyword match
    if (
      queryLower.includes(act.category.toLowerCase()) ||
      queryLower.includes(act.subSkill.toLowerCase()) ||
      act.tags.some((t) => queryLower.includes(t.toLowerCase()))
    ) {
      score += 15;
      highlights.push(`Matches ${act.category}`);
    }

    // Metro Line / Station match
    if (
      queryLower.includes(act.metroLineName.toLowerCase()) ||
      queryLower.includes(act.metroStationName.toLowerCase()) ||
      queryLower.includes('metro') ||
      queryLower.includes('station') ||
      queryLower.includes('moscow')
    ) {
      score += 8;
      highlights.push(`Near ${act.metroStationName} (${act.walkMinutes} min walk)`);
    }

    // Schedule / Day match
    const matchedDays = act.schedule.days.filter((d) => queryLower.includes(d.toLowerCase()));
    if (matchedDays.length > 0) {
      score += 10;
      highlights.push(`${matchedDays.join(', ')} slot`);
    } else {
      highlights.push(`Schedule: ${act.schedule.specificDaysText}`);
    }

    // Price / Budget match
    if (queryLower.includes('free') || queryLower.includes('cheap') || queryLower.includes('ruble') || queryLower.includes('₽')) {
      highlights.push(`${act.price.toLocaleString('ru-RU')} ₽ / class`);
    }

    return {
      activityId: act.id,
      matchPercentage: Math.min(98, score),
      reason: `Matches your interest in ${act.title} near ${act.metroStationName} station with convenient ${act.schedule.specificDaysText} schedule.`,
      highlights: highlights.slice(0, 3),
    };
  });

  // Sort by highest match score
  return scored.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4);
}
