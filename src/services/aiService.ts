import { Activity, AiMatchResult } from '../types';

export async function findAiMatches(
  userQuery: string,
  activities: Activity[]
): Promise<AiMatchResult[]> {
  try {
    const res = await fetch('/api/ai-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userQuery, activities }),
    });

    if (res.ok) {
      const parsed = await res.json();
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      console.warn('Server AI endpoint error, using smart fallback:', errJson.error || res.statusText);
    }
  } catch (err) {
    console.warn('AI service network/server error, falling back to smart local matcher:', err);
  }

  // Fallback intelligent matching engine if API key is not set on server or call fails
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
