import { Request, Response, NextFunction } from "express";
import { RateLimitError } from "../errors/RateLimitError";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanupOldEntries();
  }

  private getKey(req: Request): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  private cleanupOldEntries(): void {
    setInterval(() => {
      const now = Date.now();
      Object.keys(this.store).forEach((key) => {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      });
    }, this.config.windowMs);
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      if (!this.store[key]) {
        this.store[key] = {
          count: 1,
          resetTime: now + this.config.windowMs,
        };
        return next();
      }

      const entry = this.store[key];

      // Reset if window expired
      if (entry.resetTime < now) {
        entry.count = 1;
        entry.resetTime = now + this.config.windowMs;
        return next();
      }

      entry.count++;

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", this.config.maxRequests);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, this.config.maxRequests - entry.count));
      res.setHeader("X-RateLimit-Reset", new Date(entry.resetTime).toISOString());

      if (entry.count > this.config.maxRequests) {
        return next(
          new RateLimitError("Too many requests, please try again later", {
            retryAfter: Math.ceil((entry.resetTime - now) / 1000),
          })
        );
      }

      next();
    };
  }
}

export const createRateLimiter = (config: RateLimitConfig) => new RateLimiter(config).middleware();
