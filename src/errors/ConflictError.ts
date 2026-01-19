import { HttpError } from "../core/HttpError";

export class ConflictError extends HttpError {
  constructor(message = "Conflict", details?: any) {
    super(message, 409, details);
  }
}
