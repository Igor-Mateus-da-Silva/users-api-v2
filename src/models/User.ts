import { model, Schema } from "mongoose";

import type { IUser } from "../types/User.js";

const userSchema = new Schema<IUser>(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Partial<IUser>) => {
        delete ret.senha;
        return ret;
      }
    },
    toObject: {
      transform: (_doc, ret: Partial<IUser>) => {
        delete ret.senha;
        return ret;
      }
    }
  }
);

export const User = model<IUser>("User", userSchema);
