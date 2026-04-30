import type { HydratedDocument } from "mongoose";

import { User } from "../models/User.js";
import type { IUser } from "../types/User.js";

type UserDocument = HydratedDocument<IUser>;

export const userService = {
  async create(userData: IUser): Promise<UserDocument> {
    return User.create(userData);
  },

  async listAll(): Promise<UserDocument[]> {
    return User.find().exec();
  },

  async listById(id: string): Promise<UserDocument | null> {
    return User.findById(id).exec();
  }
};
