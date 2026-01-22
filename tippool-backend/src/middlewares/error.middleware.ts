import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    // Handle SyntaxError (JSON parse error)
    if (err instanceof SyntaxError && 'body' in err) {
        return errorResponse(res, 'Invalid JSON payload', 400);
    }

    return errorResponse(res, 'Internal Server Error', 500);
};
