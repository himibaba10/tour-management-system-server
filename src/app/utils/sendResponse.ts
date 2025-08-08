import { Response } from "express";

interface TMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPage?: number;
}

interface TSendResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
}

const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data.status).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
