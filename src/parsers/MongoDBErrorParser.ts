import { BaseError } from "../core/BaseError";
import { InternalServerError } from "../errors/InternalServerError";
import { ConflictError } from "../errors/ConflictError";
import { ValidationError } from "../errors/ValidationError";
import { BadRequestError } from "../errors/BadRequestError";

export interface ParsedMongoError {
  message: string;
  statusCode: number;
  details?: any;
}

export class MongoDBErrorParser {
  /**
   * Parse MongoDB errors and convert them to standardized errors
   */
  static parse(error: any): ParsedMongoError {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return {
        message: `Duplicate value for field: ${field}`,
        statusCode: 409,
        details: { field, value: error.keyValue[field] },
      };
    }

    // Validation error
    if (error.name === "ValidationError") {
      const errors = Object.entries(error.errors).reduce((acc: any, [key, val]: any) => {
        acc[key] = val.message;
        return acc;
      }, {});

      return {
        message: "Validation Error",
        statusCode: 422,
        details: { errors },
      };
    }

    // Cast error
    if (error.name === "CastError") {
      return {
        message: `Invalid ${error.kind}: ${error.value}`,
        statusCode: 400,
        details: { path: error.path, value: error.value },
      };
    }

    // Generic MongoDB error
    return {
      message: error.message || "Database Error",
      statusCode: 500,
      details: { originalError: error.name },
    };
  }

  /**
   * Convert parsed error to appropriate error instance
   */
  static toBaseError(error: any): BaseError {
    const parsed = this.parse(error);

    switch (parsed.statusCode) {
      case 409:
        return new ConflictError(parsed.message, parsed.details);
      case 422:
        return new ValidationError(parsed.message, parsed.details);
      case 400:
        return new BadRequestError(parsed.message, parsed.details);
      default:
        return new InternalServerError(parsed.message, parsed.details);
    }
  }
}
