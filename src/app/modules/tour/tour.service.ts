import deleteImageFromCloudinary from "../../utils/deleteImageFromCloudinary";
import QueryBuilder from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import Tour, { TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const toursQuery = new QueryBuilder(Tour.find(), query);
  const tours = await toursQuery
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate()
    .build();

  const meta = await toursQuery.getMeta();

  return {
    data: tours,
    meta,
  };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug });
  return {
    data: tour,
  };
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(tourId);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  let updatedImages = existingTour.images || [];

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    updatedImages = existingTour.images!.filter(
      (image) => !payload.deleteImages!.includes(image)
    );
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    updatedImages = [...updatedImages, ...payload.images];
  }

  payload.images = updatedImages;

  const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
  });

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    await Promise.all(
      payload.deleteImages.map(async (image) =>
        deleteImageFromCloudinary(image)
      )
    );
  }

  return updatedTour;
};

const deleteTour = async (tourId: string) => {
  return await Tour.findByIdAndDelete(tourId);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name: payload });
};

const getAllTourTypes = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(
    id,
    { name: payload },
    {
      new: true,
    }
  );
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

const tourServices = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};

export default tourServices;
