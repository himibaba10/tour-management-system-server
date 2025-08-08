import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import QueryBuilder from "../../utils/QueryBuilder";
import { divisionSearchableFields } from "./division.constant";
import { IDivision } from "./division.interface";
import Division from "./division.model";
import deleteImageFromCloudinary from "../../utils/deleteImageFromCloudinary";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new AppError(
      "A division with this name already exists.",
      httpStatus.CONFLICT
    );
  }

  const division = await Division.create(payload);

  return division;
};

const getAllDivisions = async (query: Record<string, string>) => {
  const divisionsQuery = new QueryBuilder(Division.find(), query);
  const divisions = await divisionsQuery
    .filter()
    .search(divisionSearchableFields)
    .sort()
    .fields()
    .paginate()
    .build();

  const meta = await divisionsQuery.getMeta();

  return {
    data: divisions,
    meta,
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  const existingDivision = await Division.findById(divisionId);
  if (!existingDivision) {
    throw new AppError("Division not found.", httpStatus.NOT_FOUND);
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new AppError(
      "A division with this name already exists.",
      httpStatus.CONFLICT
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (existingDivision.thumbnail && payload.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  return updatedDivision;
};

const deleteDivision = async (divisionId: string) => {
  await Division.findByIdAndDelete(divisionId);
  return null;
};

const divisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

export default divisionServices;
