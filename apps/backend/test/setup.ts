import { beforeEach, vi } from 'vitest';

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test_user:test_pass@localhost:5432/test_quiz_app';
process.env.JWT_SECRET = 'test-secret';
process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';
process.env.AUTH0_CLIENT_ID = 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';

// Mock Sentry for tests
vi.mock('@sentry/node', () => ({
    init: vi.fn(),
    captureException: vi.fn(),
    withScope: vi.fn((callback) => callback({ setTag: vi.fn(), setContext: vi.fn() })),
}));

// Clean up after each test
beforeEach(() => {
    vi.clearAllMocks();
});