import { ValidationError } from "../errors/ValidationError";

export interface ValidationErrorParsed {
  field: string;
  message: string;
  code?: string;
}

export class ValidationErrorAdapter {
  /**
   * Parse Zod errors
   */
  static parseZod(error: any): ValidationErrorParsed[] {
    if (!error.errors) return [];

    return error.errors.map((err: any) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    }));
  }

  /**
   * Parse Joi errors
   */
  static parseJoi(error: any): ValidationErrorParsed[] {
    if (!error.details) return [];

    return error.details.map((detail: any) => ({
      field: detail.path.join("."),
      message: detail.message,
      code: detail.type,
    }));
  }

  /**
   * Convert to ValidationError
   */
  static toValidationError(error: any, adapter: "zod" | "joi"): ValidationError {
    const errors = adapter === "zod" ? this.parseZod(error) : this.parseJoi(error);

    return new ValidationError("Validation Error", {
      errors: errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as Record<string, string>),
    });
  }
}
