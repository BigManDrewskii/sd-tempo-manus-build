import * as Sentry from "@sentry/node";

export function initSentry() {
  // Only initialize Sentry in production
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || "",
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
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
export function setUserContext(user: { id: number; email: string; name: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    email: user.email,
    username: user.name,
  });
}

// Middleware to capture request errors
export function sentryErrorHandler(err: Error, req: any, res: any, next: any) {
  Sentry.captureException(err, {
    extra: {
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
    },
  });
  next(err);
}

