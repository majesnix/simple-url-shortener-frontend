import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import InputUrl from './InputUrl';

vi.mock('@solid-primitives/clipboard', () => ({
  writeClipboard: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

describe('InputUrl', () => {
  it('renders the domain header', () => {
    render(() => <InputUrl />);
    expect(screen.getByRole('heading')).toHaveTextContent('test.com');
  });

  it('renders the input field and shorten button', () => {
    render(() => <InputUrl />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
  });

  it('displays the shortened URL after clicking Shorten', async () => {
    render(() => <InputUrl />);

    fireEvent.input(screen.getByRole('textbox'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('https://test.com/abc123')).toBeInTheDocument();
    });
  });

  it('shows an error toast when the API returns 400', async () => {
    server.use(
      http.post('http://test-api.com', () => new HttpResponse(null, { status: 400 }))
    );

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'not-a-url' } });

    await fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    });
  });

  it('shows an error toast when the API returns 500', async () => {
    server.use(
      http.post('http://test-api.com', () => new HttpResponse(null, { status: 500 }))
    );

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });

    await fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('copies the short URL to clipboard and shows a success toast when clicked', async () => {
    const { writeClipboard } = await import('@solid-primitives/clipboard');

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => screen.getByText('https://test.com/abc123'));
    fireEvent.click(screen.getByText('https://test.com/abc123'));

    expect(vi.mocked(writeClipboard)).toHaveBeenCalledWith('https://test.com/abc123');

    await waitFor(() => {
      expect(screen.getAllByText('Copied to clipboard!').length).toBeGreaterThan(0);
    });
  });

  it('submits when Enter is pressed in the input and copies the result', async () => {
    const { writeClipboard } = await import('@solid-primitives/clipboard');

    render(() => <InputUrl />);
    const input = screen.getByRole('textbox');
    fireEvent.input(input, { target: { value: 'https://example.com' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('https://test.com/abc123')).toBeInTheDocument();
    });
    expect(vi.mocked(writeClipboard)).toHaveBeenCalledWith('https://test.com/abc123');
  });

  it('does not report a copy when shortening fails', async () => {
    const { writeClipboard } = await import('@solid-primitives/clipboard');
    server.use(
      http.post('http://test-api.com', () => new HttpResponse(null, { status: 400 }))
    );

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'not-a-url' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => screen.getByText('Invalid URL'));
    expect(vi.mocked(writeClipboard)).not.toHaveBeenCalled();
  });

  it('sends only one request while a submission is pending', async () => {
    let calls = 0;
    server.use(
      http.post('http://test-api.com', async () => {
        calls++;
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json({ short: 'abc123' });
      })
    );

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });
    const form = screen.getByRole('textbox').closest('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    await waitFor(() => screen.getByText('https://test.com/abc123'));
    expect(calls).toBe(1);
  });

  it('sends the selected expiry and omits it for "No expiry"', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.post('http://test-api.com', async ({ request }) => {
        bodies.push(await request.json());
        return HttpResponse.json({ short: 'abc123' });
      })
    );

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });
    const button = screen.getByRole('button', { name: /shorten/i });

    fireEvent.click(button);
    await waitFor(() => expect(bodies).toHaveLength(1));
    await waitFor(() => expect(button).not.toBeDisabled());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1x' } });
    fireEvent.click(button);
    await waitFor(() => expect(bodies).toHaveLength(2));

    expect(bodies[0]).toEqual({ url: 'https://example.com' });
    expect(bodies[1]).toEqual({ url: 'https://example.com', expiry: '1x' });
  });

  it('shows an error toast when the server cannot be reached', async () => {
    server.use(http.post('http://test-api.com', () => HttpResponse.error()));

    render(() => <InputUrl />);
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('Could not reach the server')).toBeInTheDocument();
    });
  });
});
