import { BaseError } from "./BaseError";

export class HttpError extends BaseError {
  constructor(message: string, statusCode: number, details?: any) {
    super(message, statusCode, true, details);
  }
}
