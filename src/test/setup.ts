import '@testing-library/jest-dom';
import { server } from './server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// jsdom does not implement the Web Animations API; stub it so solid-toast does not throw
Element.prototype.animate = () =>
  ({
    onfinish: null,
    finished: Promise.resolve(),
    cancel: () => {},
  }) as unknown as Animation;

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
