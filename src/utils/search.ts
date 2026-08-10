import { Activity } from '../types';

/**
 * Calculate Levenshtein distance between two strings for typo tolerance.
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const str1 = a.toLowerCase();
  const str2 = b.toLowerCase();

  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export interface TokenMatchResult {
  matched: boolean;
  score: number;
  type: 'exact' | 'prefix' | 'substring' | 'fuzzy' | 'none';
}

/**
 * Evaluate single query token against target word with typo tolerance & partial matching.
 */
export function matchToken(queryToken: string, targetWord: string): TokenMatchResult {
  const q = queryToken.toLowerCase().trim();
  const t = targetWord.toLowerCase().trim();

  if (!q || !t) return { matched: false, score: 0, type: 'none' };

  // Exact Match
  if (q === t) {
    return { matched: true, score: 1.0, type: 'exact' };
  }

  // Prefix Match (e.g. "yog" -> "yoga")
  if (t.startsWith(q)) {
    return { matched: true, score: 0.9, type: 'prefix' };
  }

  // Substring Match (e.g. "pilat" -> "Yoga & Pilates")
  if (t.includes(q)) {
    return { matched: true, score: 0.8, type: 'substring' };
  }

  // Typo tolerance / Fuzzy Match using Levenshtein distance
  const maxAllowedDistance = q.length > 6 ? 2 : q.length >= 3 ? 1 : 0;
  if (maxAllowedDistance > 0) {
    const dist = calculateLevenshteinDistance(q, t);
    if (dist <= maxAllowedDistance) {
      const penalty = dist * 0.15;
      return { matched: true, score: Math.max(0.5, 0.75 - penalty), type: 'fuzzy' };
    }
  }

  return { matched: false, score: 0, type: 'none' };
}

export interface SearchRelevanceResult {
  isMatch: boolean;
  score: number; // 0 to 100
  matchedFields: string[];
}

/**
 * Evaluates activity against search query across title, category, tags, skills, instructor, provider, metro, audience.
 */
export function calculateSearchRelevance(activity: Activity, query: string): SearchRelevanceResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { isMatch: true, score: 100, matchedFields: [] };
  }

  const queryTokens = trimmed.toLowerCase().split(/[\s,\-/+&]+/).filter(Boolean);
  if (queryTokens.length === 0) {
    return { isMatch: true, score: 100, matchedFields: [] };
  }

  // Multi-field targets with specific field weight priorities
  const fieldsToSearch: { name: string; weight: number; values: string[] }[] = [
    {
      name: 'title',
      weight: 3.5,
      values: [activity.title],
    },
    {
      name: 'category',
      weight: 2.8,
      values: [activity.category],
    },
    {
      name: 'skills',
      weight: 2.5,
      values: [
        activity.subSkill,
        ...(activity.skillsGained || []),
        ...(activity.learningOutcomes || []),
      ],
    },
    {
      name: 'metro',
      weight: 2.2,
      values: [
        activity.metroStationName,
        activity.metroStation,
        activity.metroLineName,
        activity.metroLine,
      ],
    },
    {
      name: 'instructor',
      weight: 1.8,
      values: [
        activity.instructorName,
        activity.teacher?.name,
        activity.teacher?.title,
        activity.teacher?.bio,
      ].filter(Boolean) as string[],
    },
    {
      name: 'provider',
      weight: 1.8,
      values: [
        activity.studioName,
        activity.studio?.name,
      ].filter(Boolean) as string[],
    },
    {
      name: 'tags',
      weight: 1.5,
      values: activity.tags || [],
    },
    {
      name: 'audience',
      weight: 1.5,
      values: [activity.audience, activity.ageGroup].filter(Boolean) as string[],
    },
    {
      name: 'description',
      weight: 1.0,
      values: [activity.shortDescription, activity.fullDescription].filter(Boolean) as string[],
    },
  ];

  let totalWeightedScore = 0;
  let matchedTokensCount = 0;
  const matchedFieldNames = new Set<string>();

  // Check each query token
  for (const qToken of queryTokens) {
    let bestTokenScore = 0;
    let bestFieldWeight = 0;
    let tokenMatched = false;

    for (const field of fieldsToSearch) {
      for (const val of field.values) {
        if (!val) continue;
        const targetWords = val.toLowerCase().split(/[\s,\-/+&.]+/).filter(Boolean);

        // Also check raw string substring for multi-word exact query matches
        if (val.toLowerCase().includes(qToken)) {
          tokenMatched = true;
          const score = 0.85 * field.weight;
          if (score > bestTokenScore) {
            bestTokenScore = score;
            bestFieldWeight = field.weight;
            matchedFieldNames.add(field.name);
          }
        }

        for (const tWord of targetWords) {
          const matchRes = matchToken(qToken, tWord);
          if (matchRes.matched) {
            tokenMatched = true;
            const score = matchRes.score * field.weight;
            if (score > bestTokenScore) {
              bestTokenScore = score;
              bestFieldWeight = field.weight;
              matchedFieldNames.add(field.name);
            }
          }
        }
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
      totalWeightedScore += bestTokenScore;
    }
  }

  // All tokens must match or have strong fuzzy match for filtering inclusion
  const tokenMatchRatio = matchedTokensCount / queryTokens.length;
  const isMatch = tokenMatchRatio >= 0.75 || (queryTokens.length === 1 && matchedTokensCount === 1);

  // Normalize score to 0 - 100
  const maxPossibleScore = queryTokens.length * 3.5;
  const rawPercentage = (totalWeightedScore / maxPossibleScore) * 100;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawPercentage * (tokenMatchRatio * 0.5 + 0.5))));

  return {
    isMatch,
    score: isMatch ? finalScore : 0,
    matchedFields: Array.from(matchedFieldNames),
  };
}

/**
 * Filter and score activities based on search query.
 */
export function searchActivities(activities: Activity[], query: string): Activity[] {
  if (!query.trim()) return activities;

  return activities
    .map((act) => {
      const searchRes = calculateSearchRelevance(act, query);
      return { activity: act, searchRes };
    })
    .filter(({ searchRes }) => searchRes.isMatch)
    .map(({ activity }) => activity);
}
