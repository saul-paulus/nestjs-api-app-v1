export interface SuccessResponse<T = unknown> {
  success: boolean;
  responseCode: number;
  message: string;
  data: T;
  meta?: unknown;
  links?: unknown;
}

export interface ErrorResponse {
  success: boolean;
  responseCode: number;
  message: string;
  errors?: unknown;
}

export const successResponse = <T>(
  responseCode: number,
  message: string,
  data: T,
  meta: unknown = null,
  links: unknown = null,
): SuccessResponse<T> => {
  const response: SuccessResponse<T> = {
    success: true,
    responseCode,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }
  if (links) {
    response.links = links;
  }

  return response;
};

export const errorResponse = (
  responseCode: number,
  message: string,
  errors: unknown = null,
): ErrorResponse => {
  const response: ErrorResponse = {
    success: false,
    responseCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};
