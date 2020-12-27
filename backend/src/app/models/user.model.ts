import { model, Model, Schema, Document } from "mongoose";


const UserSchema: Schema = new Schema({
  email :  { type: String, unique: true, required: true },
  password : { type: String, required: true },
  firstname : String,
  lastname : String,
  created : Date,
  active : Boolean,
  verified : Boolean
});

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  created: Date;
  active: Boolean;
  verified: Boolean;
}

export const User: Model<IUser> = model('User', UserSchema);
