/** @jest-environment node */

import { GET } from './route';

describe('GET /api/health', () => {
  it('returns ok envelope with setup metadata', async () => {
    const response = await GET(new Request('http://localhost/api/health'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.data.status).toBe('ok');
    expect(payload.data.message).toBe('CultureLens API Running');
    expect(payload.data.setup).toBeDefined();
    expect(typeof payload.meta.requestId).toBe('string');
  });
});
