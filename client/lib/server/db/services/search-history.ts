import { SearchHistoryModel } from "@/lib/server/db/models/search-history";
import { connectToDatabase } from "@/lib/server/db/mongoose";
import type { ExplainOutput } from "@/lib/server/explain";
import { detectTrendSignal } from "@/lib/server/ai/trend-detection";

type PersistSearchInput = {
  queryText: string;
  userCountry?: string;
  userLanguage?: string;
  result: ExplainOutput;
};

export async function persistSearchHistory(
  input: PersistSearchInput
): Promise<{ id: string } | null> {
  try {
    await connectToDatabase();

    const created = await SearchHistoryModel.create({
      queryText: input.queryText,
      userCountry: input.userCountry,
      userLanguage: input.userLanguage,
      reference: input.result.reference,
      originCulture: input.result.originCulture,
      localAnalogy: input.result.localAnalogy,
    });

    return { id: String(created._id) };
  } catch (error) {
    console.warn("[db] could not persist search history", error);
    return null;
  }
}

export type TrendingReference = {
  reference: string;
  count: number;
  latestAt: string;
  trendScore: number;
  trendLabel: "rising" | "stable" | "cooling";
  momentum: number;
};

function shortReference(ref: string): string {
  // If ref is a question, keep up to first '?', else up to first 6 words
  if (ref.includes('?')) {
    return ref.split('?')[0].split(' ').slice(0, 12).join(' ') + '?';
  }
  const words = ref.split(' ');
  if (words.length <= 4) return ref;
  return words.slice(0, 4).join(' ') + (words.length > 4 ? '…' : '');
}

export async function getTrendingReferences(options?: {
  limit?: number;
  sinceDays?: number;
}): Promise<TrendingReference[]> {
  const limit = options?.limit ?? 8;
  const preLimit = Math.max(limit * 5, 50);
  const sinceDays = options?.sinceDays ?? 14;
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const recentCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const previousCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  try {
    await connectToDatabase();

    const rows = await SearchHistoryModel.aggregate<{
      _id: string;
      count: number;
      latestAt: Date;
      recentCount: number;
      previousCount: number;
    }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$reference",
          count: { $sum: 1 },
          latestAt: { $max: "$createdAt" },
          recentCount: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", recentCutoff] }, 1, 0],
            },
          },
          previousCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$createdAt", recentCutoff] },
                    { $gte: ["$createdAt", previousCutoff] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { latestAt: -1 } },
      { $limit: preLimit },
    ]);

    const detected = rows
      .map((row) => {
        const trend = detectTrendSignal({
          totalCount: row.count,
          recentCount: row.recentCount,
          previousCount: row.previousCount,
          latestAt: row.latestAt,
        });
        return {
          reference: row._id,
          count: row.count,
          latestAt: row.latestAt,
          trend,
        };
      })
      .sort((a, b) => b.trend.trendScore - a.trend.trendScore)
      .slice(0, limit);

    return detected.map((row) => ({
      reference: shortReference(row.reference),
      count: row.count,
      latestAt: row.latestAt.toISOString(),
      trendScore: row.trend.trendScore,
      trendLabel: row.trend.trendLabel,
      momentum: row.trend.momentum,
    }));
  } catch (error) {
    console.warn("[db] could not fetch trending references", error);
    return [];
  }
}
