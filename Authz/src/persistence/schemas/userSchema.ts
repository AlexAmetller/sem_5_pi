import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'warehouse-manager', 'logistics-manager', 'fleet-manager'],
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', UserSchema);
