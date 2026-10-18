import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

export function errorHandler(error: unknown, request: Request, response: Response, next: NextFunction) : void {
    console.error(error)
    if (error instanceof z.ZodError) {
        const details = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }))
        response.status(400).json({
            error: {
                status: 400,
                message: 'Validation failed',
                details
            }
        });
        return;
    }
    if(error instanceof Error && 'status' in error && typeof (error.status) == 'number'){
        response.status(error.status).json({
            error: {
                status: error.status,
                message: error.message
            }
        })
        return;
    }
    response.status(500).json({
            success: false,
            message: 'Server Error'
    })
}
