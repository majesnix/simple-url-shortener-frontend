import { http, HttpResponse } from 'msw';

export const API_URL = 'http://test-api.local';

export const handlers = [
  http.post(API_URL, async ({ request }) => {
    const body = await request.json() as { url: string };
    if ((body as { url: string }).url === 'https://invalid.url') {
      return HttpResponse.json({ error: 'Invalid URL' }, { status: 400 });
    } else if ((body as { url: string }).url === 'https://500.error') {
      return HttpResponse.json({}, { status: 500 })
    }
    return HttpResponse.json({ short: 'abc123' });
  }),

  http.get(`${API_URL}/:code`, ({ params }) => {
    const { code } = params;
    if (code === 'notfound') {
      return new HttpResponse(null, { status: 404 });
    }
    if (code === 'nohttp') {
      return HttpResponse.json({ url: 'example.com' });
    }
    return HttpResponse.json({ url: 'https://example.com' });
  }),
];
