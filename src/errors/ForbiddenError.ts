import { HttpError } from "../core/HttpError";

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details?: any) {
    super(message, 403, details);
  }
}
