import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import tourServices from "./tour.service";
import sendResponse from "../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await tourServices.createTour(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await tourServices.getAllTours(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tours retrieved successfully",
    data,
    meta,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await tourServices.getSingleTour(slug);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour retrieved",
    data: result.data,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const result = await tourServices.updateTour(req.params.id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tourServices.deleteTour(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await tourServices.getAllTourTypes();
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await tourServices.createTourType(name);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await tourServices.updateTourType(id, name);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tourServices.deleteTourType(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

const tourControllers = {
  createTour,
  createTourType,
  getAllTourTypes,
  deleteTourType,
  updateTourType,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};

export default tourControllers;
