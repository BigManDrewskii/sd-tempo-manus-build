import * as Sentry from "@sentry/react";

export function initSentry() {
  // Only initialize Sentry in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || "",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions to conserve quota
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      environment: import.meta.env.MODE,
    });
  }
}

// Helper to manually capture errors
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to set user context
export function setUserContext(user: { id: number; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    email: user.email || undefined,
    username: user.name || undefined,
  });
}

// Helper to clear user context on logout
export function clearUserContext() {
  Sentry.setUser(null);
}

