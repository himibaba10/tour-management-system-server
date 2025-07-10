import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const notFoundHandler = (_req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "The resource is not Found",
  });
};

export default notFoundHandler;
