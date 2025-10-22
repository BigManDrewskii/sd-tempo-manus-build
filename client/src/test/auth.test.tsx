import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

// Mock the trpc module
vi.mock('@/lib/trpc', () => ({
  trpc: {
    auth: {
      me: {
        useQuery: vi.fn(),
      },
      logout: {
        useMutation: vi.fn(),
      },
    },
  },
}));

describe('Authentication Flow', () => {
  it('should return null when user is not authenticated', () => {
    // Mock unauthenticated state
    vi.mocked(trpc.auth.me.useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    // Test the hook directly
    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? 'Authenticated' : 'Not Authenticated'}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });

  it('should return user data when authenticated', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    // Mock authenticated state
    vi.mocked(trpc.auth.me.useQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    } as any);

    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? `Hello ${user.name}` : 'Not Authenticated'}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Hello Test User')).toBeInTheDocument();
  });

  it('should show loading state while fetching user', () => {
    // Mock loading state
    vi.mocked(trpc.auth.me.useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    const TestComponent = () => {
      const { user, isLoading } = useAuth();
      return <div>{isLoading ? 'Loading...' : 'Loaded'}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

