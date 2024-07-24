import { IPathPersistence } from '../../dataschema/IPathPersistence';
import mongoose from 'mongoose';

const PathSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      required: [true, 'Please enter a valid Matricula'],
      unique: true,
    },
    truckId: {
      type: String,
      required: [true, 'Please enter truck id'],
    },
    startWarehouse: {
      type: String,
      required: [true, 'Please enter warehouse start code'],
    },
    endWarehouse: {
      type: String,
      required: [true, 'Please enter warehouse end code'],
    },
    distance: {
      type: Number,
      required: [true, 'Please enter distance'],
    },
    time: {
      type: Number,
      required: [true, 'Please enter time'],
    },
    batteryConsumption: {
      type: Number,
      required: [true, 'Please enter battery consumption'],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPathPersistence & mongoose.Document>('Path', PathSchema);
