import '@testing-library/jest-dom';
import { server } from "./server";
import { beforeAll, afterAll, afterEach } from "vitest";

beforeAll(() => { server.close(); server.listen() });
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
