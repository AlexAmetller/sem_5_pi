import { IPackagingPersistence } from '../../dataschema/IPackagingPersistence';
import mongoose from 'mongoose';

const PackagingSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      required: [true, 'Please enter a packaging id'],
      unique: true,
    },
    xposition: {
      type: Number,
      required: [true, 'Please enter x position'],
    },
    yposition: {
      type: Number,
      required: [true, 'Please enter y position'],
    },
    zposition: {
      type: Number,
      required: [true, 'Please enter z position'],
    },
    loadingTime: {
      type: Number,
      required: [true, 'Please enter loading time'],
    },
    withdrawingTime: {
      type: Number,
      required: [true, 'Please enter withdrawl time'],
    },
    deliveryId: {
      type: String,
      required: [true, 'Please enter delivery id'],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPackagingPersistence & mongoose.Document>('Packaging', PackagingSchema);
