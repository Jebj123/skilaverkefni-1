import { Request, Response, NextFunction } from 'express';
import z, { ZodSchema, ZodError } from 'zod';

export function validate(schema: z.ZodSchema){
    return(request: Request, response: Response, next: NextFunction) : void => {
    try{
        request.body = schema.parse(request.body);
        next();
    }catch(error){
        next(error);
        }
    }
}

export function validateParams(schema: z.ZodSchema){
    return(request: Request, response: Response, next: NextFunction) : void => {
        try{
            schema.parse(request.params);
            next();
        }catch(error){
         next(error)
        }
    }
}

export function validateQuery(schema: z.ZodSchema){
    return(request: Request, response: Response, next: NextFunction) : void => {
        try{
            schema.parse(request.query);
            next();
        }catch(error){
            next(error);
        }
    }
}

export function notFound(){
    return(request: Request, response: Response, next: NextFunction) : void => {
        response.status(404).json({success: false, error: 'Not found'});
    }
}