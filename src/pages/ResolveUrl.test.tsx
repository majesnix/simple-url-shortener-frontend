import { render, screen, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import ResolveUrl from './ResolveUrl';


describe('ResolveUrl', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/abc123', href: '' },
      writable: true,
      configurable: true,
    });
  });

  it('redirects to the resolved URL', async () => {
    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com');
    });
  });

  it('prepends https:// when the stored URL has no protocol', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/nohttp', href: '' },
      writable: true,
      configurable: true,
    });

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com');
    });
  });

  it('shows 404 image when the short code is not found', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/notfound', href: '' },
      writable: true,
      configurable: true,
    });

    render(() => <ResolveUrl />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
