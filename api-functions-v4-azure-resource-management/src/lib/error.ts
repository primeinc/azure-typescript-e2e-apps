import { HttpResponseInit } from '@azure/functions';

export function processError(err: unknown): HttpResponseInit {
  if (typeof err === 'string') {
    return { body: err.toUpperCase(), status: 500 };
  } else if (err instanceof Error) {
    if (err.stack && process.env.NODE_ENV?.toLowerCase() !== 'production') {
      return {
        jsonBody: { stack: err.stack, message: err.message },
        status: 500
      };
    }
    return { body: err.message, status: 500 };
  } else {
    return { body: JSON.stringify(err), status: 500 };
  }
}
