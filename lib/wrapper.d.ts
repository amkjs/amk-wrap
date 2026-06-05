import { Request, Response, NextFunction } from 'express';

declare function wrap(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown
): (req: Request, res: Response, next: NextFunction) => void;

declare function wrap<T extends Record<string, any>>(
  context: T,
  methodName: keyof T
): (req: Request, res: Response, next: NextFunction) => void;

declare namespace wrap {
  export type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<unknown> | unknown;
}

export = wrap;
