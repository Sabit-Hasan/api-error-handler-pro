import { Request, Response, NextFunction } from "express";
import { serializeError } from "../utils/serializeError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serialized = serializeError(err);
  res.status(serialized.statusCode).json(serialized);
};
