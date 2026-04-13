import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import InputUrl from './InputUrl';

vi.mock('@solid-primitives/clipboard', () => ({
  writeClipboard: vi.fn(),
}));

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

    // shorten() throws after showing the toast — catch the rejection
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

    // shorten() throws after showing the toast — catch the rejection
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
      expect(screen.getByText('Copied to clipboard!')).toBeInTheDocument();
    });
  });
});
