import Booking from "../booking/booking.model";
import Tour from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import User from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const sixtyDaysAgo = new Date(now).setDate(now.getDate() - 60);
const ninetyDaysAgo = new Date(now).setDate(now.getDate() - 90);

const getUserStats = async () => {
  const allUsersPromise = User.countDocuments();
  const allActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const allInactiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const allBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(sevenDaysAgo) },
  });

  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(thirtyDaysAgo) },
  });

  const newUsersInLast60DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(sixtyDaysAgo) },
  });

  const newUsersInLast90DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(ninetyDaysAgo) },
  });

  const usersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    allUsers,
    allActiveUsers,
    allInactiveUsers,
    allBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    newUsersInLast60Days,
    newUsersInLast90Days,
    usersByRole,
  ] = await Promise.all([
    allUsersPromise,
    allActiveUsersPromise,
    allInactiveUsersPromise,
    allBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    newUsersInLast60DaysPromise,
    newUsersInLast90DaysPromise,
    usersByRolePromise,
  ]);

  return {
    allUsers,
    allActiveUsers,
    allInactiveUsers,
    allBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    newUsersInLast60Days,
    newUsersInLast90Days,
    usersByRole,
  };
};

const getTourStats = async () => {
  const allToursPromise = Tour.countDocuments();

  const totalTourByTourTypesPromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "tourTypeDetails",
      },
    },
    {
      $unwind: "$tourTypeDetails",
    },
    {
      $group: {
        _id: "$tourTypeDetails.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        averageCost: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionsPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookingPromise = Booking.aggregate([
    {
      $lookup: {
        from: "tours",
        localField: "tour",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $group: {
        _id: "$tour.title",
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  const [
    allTours,
    totalTourByTourTypes,
    avgTourCost,
    totalTourByDivisions,
    totalHighestBooking,
  ] = await Promise.all([
    allToursPromise,
    totalTourByTourTypesPromise,
    avgTourCostPromise,
    totalTourByDivisionsPromise,
    totalHighestBookingPromise,
  ]);

  return {
    allTours,
    totalTourByTourTypes,
    avgTourCost,
    totalTourByDivisions,
    totalHighestBooking,
  };
};

const statsServices = {
  getUserStats,
  getTourStats,
};

export default statsServices;
