import { HttpError } from "../core/HttpError";

export class ValidationError extends HttpError {
  constructor(message = "Validation Error", details?: any) {
    super(message, 422, details);
  }
}
