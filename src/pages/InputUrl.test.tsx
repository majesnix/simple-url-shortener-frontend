import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import InputUrl from './InputUrl';

const mockWriteClipboard = vi.fn();
vi.mock('@solid-primitives/clipboard', () => ({
  writeClipboard: (text: string) => mockWriteClipboard(text),
}));

vi.mock('@solid-primitives/keyboard', () => ({
  useKeyDownEvent: () => () => null,
}));

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));
vi.mock('solid-toast', () => ({
  default: { error: toastError, success: toastSuccess },
  Toaster: () => null,
}));

describe('InputUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the input field and shorten button', () => {
    render(() => <InputUrl />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
  });

  it('displays the short URL after a successful API call', async () => {
    render(() => <InputUrl />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('https://short.test/abc123')).toBeInTheDocument();
    });
  });

  it('shows an error toast when the API returns 400', async () => {
    const rendered = render(() => <InputUrl />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://invalid.url' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Invalid URL');
      expect(render).toThrow()
    });
  });

  it('shows an error toast when the API returns a 5xx error', async () => {

    const rendered = render(() => <InputUrl />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://500.error' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Something went wrong');
      expect(render).toThrow()
    });
  });

  it('copies the short URL to clipboard when clicked', async () => {
    render(() => <InputUrl />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText('https://short.test/abc123')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('https://short.test/abc123'));

    expect(mockWriteClipboard).toHaveBeenCalledWith('https://short.test/abc123');
    expect(toastSuccess).toHaveBeenCalledWith('Copied to clipboard!');
  });
});
