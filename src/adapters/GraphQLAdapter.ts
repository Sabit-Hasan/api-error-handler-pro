import { GraphQLError } from "../errors/GraphQLError";

export interface GraphQLErrorExtensions {
  code?: string;
  statusCode?: number;
  fieldErrors?: Record<string, string>;
}

export class GraphQLErrorAdapter {
  /**
   * Convert standard error to GraphQL error format
   */
  static toGraphQLError(
    error: Error,
    extensions?: GraphQLErrorExtensions
  ): GraphQLError {
    return new GraphQLError(error.message, extensions);
  }

  /**
   * Parse GraphQL validation errors
   */
  static parseValidationErrors(errors: any[]): GraphQLErrorExtensions {
    const fieldErrors: Record<string, string> = {};

    errors.forEach((error: any) => {
      const path = error.path?.join(".") || "root";
      fieldErrors[path] = error.message;
    });

    return {
      code: "GRAPHQL_VALIDATION_ERROR",
      statusCode: 422,
      fieldErrors,
    };
  }

  /**
   * Format error for GraphQL response
   */
  static formatError(error: any): {
    message: string;
    extensions: GraphQLErrorExtensions;
  } {
    const extensions: GraphQLErrorExtensions = {
      code: error.extensions?.code || "INTERNAL_ERROR",
      statusCode: error.extensions?.statusCode || 500,
    };

    if (error.extensions?.fieldErrors) {
      extensions.fieldErrors = error.extensions.fieldErrors;
    }

    return {
      message: error.message,
      extensions,
    };
  }

  /**
   * Handle Apollo Server errors
   */
  static handleApolloError(error: any): any {
    return {
      message: error.message,
      extensions: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        statusCode: error.statusCode || 500,
        ...(error.details && { details: error.details }),
      },
    };
  }
}
