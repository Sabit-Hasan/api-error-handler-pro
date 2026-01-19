import { BaseError } from "../core/BaseError";

export class GraphQLError extends BaseError {
  constructor(message: string, extensions?: any, details?: any) {
    super(message, 400, true, { ...details, extensions });
  }
}
