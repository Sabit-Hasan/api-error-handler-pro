import { HttpError } from "../core/HttpError";

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", details?: any) {
    super(message, 404, details);
  }
}
