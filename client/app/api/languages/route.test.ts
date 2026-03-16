/** @jest-environment node */

import { GET } from './route';

describe('GET /api/languages', () => {
  it('returns supported language codes', async () => {
    const response = await GET(new Request('http://localhost/api/languages'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.data.defaultLanguage).toBe('en');
    expect(Array.isArray(payload.data.supportedLanguages)).toBe(true);
    expect(payload.data.supportedLanguages).toContain('en');
  });
});
