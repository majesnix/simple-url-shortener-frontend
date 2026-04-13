import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import ResolveUrl from './ResolveUrl';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ResolveUrl', () => {
  it('redirects to the original URL when the short code resolves', async () => {
    const mockLocation = { pathname: '/abc123', href: '' };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(mockLocation.href).toBe('https://example.com');
    });
  });

  it('shows the 404 image when the short code is not found', async () => {
    server.use(
      http.get('http://test-api.com/:shortCode', () => new HttpResponse(null, { status: 404 }))
    );

    const mockLocation = { pathname: '/notfound', href: '' };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('shows the 404 image when the API request fails', async () => {
    server.use(
      http.get('http://test-api.com/:shortCode', () => HttpResponse.error())
    );

    const mockLocation = { pathname: '/broken', href: '' };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('prepends https:// when the resolved URL has no protocol', async () => {
    server.use(
      http.get('http://test-api.com/:shortCode', () =>
        HttpResponse.json({ url: 'example.com' })
      )
    );

    const mockLocation = { pathname: '/abc123', href: '' };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(mockLocation.href).toBe('https://example.com');
    });
  });
});
