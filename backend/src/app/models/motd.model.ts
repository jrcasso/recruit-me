import { Document, Model, model, Types, Schema, Query } from 'mongoose';

// Schema
const MotdSchema = Schema({
  message: { type: String, required: true },
  foreground: { type: String, default: '#FFFFFF' },
  background: { type: String, default: '#000000'},
  timestamp: { type: Number, default: Date.now },
});

export interface Motd {
  message: string;
  foreground?: string;
  background?: string;
  timestamp?: number;
}

export interface MotdModel extends Model<UserDocument> {
  findMyCompany(id: string): Promise<UserPopulatedDocument>
}