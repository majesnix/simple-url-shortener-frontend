import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://test-api.com', () => {
    return HttpResponse.json({ short: 'abc123' });
  }),

  http.get('http://test-api.com/:shortCode', ({ params }) => {
    const { shortCode } = params;
    if (shortCode === 'notfound') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ url: 'https://example.com' });
  }),
];
