import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  carName: string;
  dailyRentPrice: number;
  carType: 'SUV' | 'Sedan' | 'Coupe' | 'Luxury' | 'Hatchback' | 'Van';
  imageURL: string;
  seatCapacity: number;
  pickupLocation: string;
  description: string;
  availabilityStatus: 'available' | 'unavailable';
  ownerEmail: string;
  ownerName: string;
  ownerPhoto?: string;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    carName: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
      index: true,
    },
    dailyRentPrice: {
      type: Number,
      required: [true, 'Daily rental price is required'],
      min: [1, 'Price must be greater than 0'],
    },
    carType: {
      type: String,
      required: [true, 'Car category/type is required'],
      enum: ['SUV', 'Sedan', 'Coupe', 'Luxury', 'Hatchback', 'Van'],
      index: true,
    },
    imageURL: {
      type: String,
      required: [true, 'Vehicle image URL is required'],
      trim: true,
    },
    seatCapacity: {
      type: Number,
      required: [true, 'Seat capacity is required'],
      min: [1, 'Seat capacity must be at least 1'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Car description is required'],
      trim: true,
    },
    availabilityStatus: {
      type: String,
      required: true,
      enum: ['available', 'unavailable'],
      default: 'available',
      index: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    ownerPhoto: {
      type: String,
      trim: true,
    },
    bookingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

CarSchema.index({ carName: 'text', description: 'text', pickupLocation: 'text' });

export const Car = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);
