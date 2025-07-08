import { Types } from "mongoose";
export enum IsActive {
  ACTIVE,
  INACTIVE,
  BLOCKED,
}

export enum Role {
  SUPER_ADMIN,
  ADMIN,
  USER,
  GUIDE,
}

export interface IAuthProvider {
  proviver: string;
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
