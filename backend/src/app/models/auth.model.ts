import { model, Model, Schema, Document, Types } from 'mongoose';


const AuthSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  token: { type: String, required: true },
  created: { type: Date, required: true, default: Date() },
  expiry: { type: Date, required: true }
});

export interface IAuth extends Document {
  _id?: Types.ObjectId;
  user_id: string;
  token: string;
  created: Date;
  expiry: Date;
}

export const Auth: Model<IAuth> = model('Auth', AuthSchema);
