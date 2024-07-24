import { ISchedulePersistence } from '../../dataschema/ISchedulePersistence';
import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      required: true,
      unique: true,
    },
    totalTime: {
      type: Number,
      required: true,
    },
    truckId: {
      type: String,
      required: true,
    },
    deliveryIds: {
      type: [String],
      required: true,
    },
    originWarehouseId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  },
);

ScheduleSchema.virtual('truck', {
  ref: 'Truck',
  localField: 'truckId',
  foreignField: 'domainId',
  justOne: true, // for many-to-1 relationships
});

export default mongoose.model<ISchedulePersistence & mongoose.Document>('Schedule', ScheduleSchema);
