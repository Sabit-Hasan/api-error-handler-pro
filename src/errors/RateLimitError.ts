import { HttpError } from "../core/HttpError";

export class RateLimitError extends HttpError {
  constructor(message = "Too Many Requests", details?: any) {
    super(message, 429, details);
  }
}
