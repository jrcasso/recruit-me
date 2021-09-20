import { model, Model, Schema, Document } from 'mongoose';


const UserSchema: Schema = new Schema({
  email:  { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  roles: { type: [ String ], required: true, default: []},
  firstname: String,
  lastname: String,
  created: { type: Date, required: true, default: Date() },
  active: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
});

export interface UserBase {
  email: string;
  password?: string;
  roles?: string[];
  firstname: string;
  lastname: string;
  created?: Date;
  active?: boolean;
  verified?: boolean;
}

export interface IUser extends Document, UserBase {}

export const User: Model<IUser> = model('User', UserSchema);
