import rateLimit from "express-rate-limit";
import type { Request } from "express";

// Helper to safely get IP address
function getClientIp(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for sensitive operations - 10 requests per hour
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Email sending limiter - 20 emails per hour
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: "Too many emails sent, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Key by user ID if authenticated, otherwise by IP
  keyGenerator: (req: AuthenticatedRequest) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    return getClientIp(req);
  },
});

// Proposal creation limiter - 30 proposals per hour
export const proposalCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: "Too many proposals created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthenticatedRequest) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    return getClientIp(req);
  },
});

// Authentication limiter - 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

