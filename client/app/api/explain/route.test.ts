/** @jest-environment node */

import { POST } from './route';
import { explainCulture } from '@/lib/server/explain';
import { persistSearchHistory } from '@/lib/server/db/services/search-history';

jest.mock('@/lib/server/explain', () => ({
  explainCulture: jest.fn(),
}));

jest.mock('@/lib/server/db/services/search-history', () => ({
  persistSearchHistory: jest.fn(),
}));

const mockedExplainCulture = explainCulture as jest.MockedFunction<typeof explainCulture>;
const mockedPersistSearchHistory =
  persistSearchHistory as jest.MockedFunction<typeof persistSearchHistory>;

describe('POST /api/explain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns explanation payload when request is valid', async () => {
    mockedExplainCulture.mockResolvedValue({
      reference: 'Roman Empire meme',
      originCulture: 'Global internet culture',
      culturalImpact: 'Widely shared joke format.',
      localAnalogy: 'Like repeatedly referencing a famous historical empire in jokes.',
      context: 'Commonly appears in short-form social posts.',
      language: 'en',
    });

    mockedPersistSearchHistory.mockResolvedValue({ id: 'history_1' });

    const response = await POST(
      new Request('http://localhost/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Roman Empire meme',
          userCountry: 'India',
          userLanguage: 'en',
        }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.data.reference).toBe('Roman Empire meme');
    expect(payload.data.historyId).toBe('history_1');
    expect(mockedExplainCulture).toHaveBeenCalledTimes(1);
    expect(mockedPersistSearchHistory).toHaveBeenCalledTimes(1);
  });

  it('returns validation error for missing text', async () => {
    const response = await POST(
      new Request('http://localhost/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCountry: 'India' }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
    expect(mockedExplainCulture).not.toHaveBeenCalled();
  });
});
