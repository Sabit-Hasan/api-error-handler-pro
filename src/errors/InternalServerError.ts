import { HttpError } from "../core/HttpError";

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", details?: any) {
    super(message, 500, details);
  }
}
