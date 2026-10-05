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
    const mockLocation = { pathname: '/abc123', replace: vi.fn() };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(mockLocation.replace).toHaveBeenCalledWith('https://example.com');
    });
  });

  it('shows the 404 image when the short code is not found', async () => {
    server.use(
      http.get('http://test-api.com/:shortCode', () => new HttpResponse(null, { status: 404 }))
    );

    const mockLocation = { pathname: '/notfound', replace: vi.fn() };
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

    const mockLocation = { pathname: '/broken', replace: vi.fn() };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('does not redirect to a URL without an http(s) protocol', async () => {
    server.use(
      http.get('http://test-api.com/:shortCode', () =>
        HttpResponse.json({ url: 'javascript:alert(1)' })
      )
    );

    const mockLocation = { pathname: '/abc123', replace: vi.fn() };
    vi.stubGlobal('location', mockLocation);

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
    expect(mockLocation.replace).not.toHaveBeenCalled();
  });
});
