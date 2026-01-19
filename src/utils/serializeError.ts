import { BaseError } from "../core/BaseError";

export const serializeError = (error: Error) => {
  if (error instanceof BaseError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  return {
    success: false,
    message: "Internal Server Error",
    statusCode: 500,
  };
};
