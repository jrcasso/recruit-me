import { model, Model, Schema, Document } from 'mongoose';


// Schema
const MotdSchema: Schema = new Schema({
  message: { type: String, required: true },
  foreground: { type: String, default: '#FFFFFF' },
  background: { type: String, default: '#000000'},
  timestamp: { type: Number, default: Date.now },
});

export interface IMotd extends Document {
  message: string;
  foreground?: string;
  background?: string;
  timestamp?: number;
}


export const Motd: Model<IMotd> = model('Motd', MotdSchema);
