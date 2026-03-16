/** @jest-environment node */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { ExplainOutput } from '@/lib/server/explain';
import type { Model } from 'mongoose';
import type { SearchHistoryDocument } from '@/lib/server/db/models/search-history';

describe('search-history db integration', () => {
  let mongo: MongoMemoryServer;
  let persistSearchHistory: (input: {
    queryText: string;
    userCountry?: string;
    userLanguage?: string;
    result: ExplainOutput;
  }) => Promise<{ id: string } | null>;
  let getTrendingReferences: (options?: {
    limit?: number;
    sinceDays?: number;
  }) => Promise<Array<{
    reference: string;
    count: number;
    latestAt: string;
    trendScore: number;
    trendLabel: 'rising' | 'stable' | 'cooling';
    momentum: number;
  }>>;
  let SearchHistoryModel: Model<SearchHistoryDocument>;

  beforeAll(async () => {
    jest.setTimeout(45_000);
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();
    process.env.MONGODB_DB_NAME = 'culturelens_test';

    const service = await import('./search-history');
    const modelModule = await import('@/lib/server/db/models/search-history');
    persistSearchHistory = service.persistSearchHistory;
    getTrendingReferences = service.getTrendingReferences;
    SearchHistoryModel = modelModule.SearchHistoryModel;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  afterEach(async () => {
    await SearchHistoryModel.deleteMany({});
  });

  it('persists explanation search history', async () => {
    const result: ExplainOutput = {
      reference: 'Roman Empire meme',
      originCulture: 'Global internet culture',
      culturalImpact: 'Widely discussed online.',
      localAnalogy: 'Like a recurring historical joke format.',
      context: 'Often seen in short-form social posts.',
      language: 'en',
    };

    const saved = await persistSearchHistory({
      queryText: 'Why is roman empire meme trending?',
      userCountry: 'India',
      userLanguage: 'en',
      result,
    });

    expect(saved).not.toBeNull();
    expect(saved?.id).toBeTruthy();

    const count = await SearchHistoryModel.countDocuments({});
    expect(count).toBe(1);
  });

  it('returns trend-scored references from persisted data', async () => {
    const resultA: ExplainOutput = {
      reference: 'Roman Empire meme',
      originCulture: 'Global internet culture',
      culturalImpact: 'Widely discussed online.',
      localAnalogy: 'Recurring social joke.',
      context: 'Seen across social apps.',
      language: 'en',
    };

    const resultB: ExplainOutput = {
      reference: 'Met Gala',
      originCulture: 'United States',
      culturalImpact: 'Fashion-heavy media event.',
      localAnalogy: 'High-visibility annual event.',
      context: 'Seen in entertainment coverage.',
      language: 'en',
    };

    await persistSearchHistory({ queryText: 'roman empire meme', result: resultA });
    await persistSearchHistory({ queryText: 'roman empire trend', result: resultA });
    await persistSearchHistory({ queryText: 'met gala outfits', result: resultB });

    const trending = await getTrendingReferences({ limit: 5, sinceDays: 14 });
    expect(trending.length).toBeGreaterThan(0);
    expect(trending[0].reference).toBeTruthy();
    expect(typeof trending[0].trendScore).toBe('number');
    expect(['rising', 'stable', 'cooling']).toContain(trending[0].trendLabel);
  });
});
