import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userEmail: string;
  userName: string;
  carId: mongoose.Types.ObjectId;
  carName: string;
  carImage: string;
  dailyRentPrice: number;
  totalPrice: number;
  rentalDays: number;
  driverNeeded: boolean;
  specialNote?: string;
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car reference is required'],
      index: true,
    },
    carName: {
      type: String,
      required: [true, 'Car name snapshot is required'],
    },
    carImage: {
      type: String,
      required: [true, 'Car image snapshot is required'],
    },
    dailyRentPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    driverNeeded: {
      type: Boolean,
      default: false,
    },
    specialNote: {
      type: String,
      trim: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ userEmail: 1, createdAt: -1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
