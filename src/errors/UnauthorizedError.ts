import { HttpError } from "../core/HttpError";

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details?: any) {
    super(message, 401, details);
  }
}
