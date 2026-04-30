import type { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof MongooseError.ValidationError) {
    return res.status(400).json({
      message: "Erro de validacao.",
      errors: Object.values(error.errors).map((validationError) => validationError.message)
    });
  }

  return res.status(500).json({
    message: "Erro interno do servidor.",
    error: error instanceof Error ? error.message : "Unknown error"
  });
};
