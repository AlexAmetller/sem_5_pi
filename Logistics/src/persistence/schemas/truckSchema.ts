import { ITruckPersistence } from '../../dataschema/ITruckPersistence';
import mongoose from 'mongoose';

const TruckSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      required: [true, 'Please enter a valid name (matricula)'],
      unique: true,
    },
    tare: {
      type: Number,
      required: [true, 'Please enter tare'],
    },
    maxWeight: {
      type: Number,
      required: [true, 'Please enter maximum weight'],
    },
    maxCharge: {
      type: Number,
      required: [true, 'Please enter maximum charge'],
    },
    range: {
      type: Number,
      required: [true, 'Please enter range'],
    },
    chargingTime: {
      type: Number,
      required: [true, 'Please enter charging time'],
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITruckPersistence & mongoose.Document>('Truck', TruckSchema);
