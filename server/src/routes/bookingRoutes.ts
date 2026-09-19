import express, { Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { Car } from '../models/Car';
import { verifyAuth, AuthenticatedRequest } from '../middleware/verifyAuth';

const router = express.Router();

// POST /api/bookings - Reserve a vehicle (Protected: Strict Server Identity)
router.post('/', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const { carId, rentalDays, driverNeeded = false, specialNote = '' } = req.body;

    if (!carId || !rentalDays || Number(rentalDays) < 1) {
      res.status(400).json({
        success: false,
        message: 'A valid car ID and rental duration (at least 1 day) are required.',
      });
      return;
    }

    if (!mongoose.isValidObjectId(carId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid vehicle identifier format.',
      });
      return;
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'The requested vehicle is no longer available in the fleet.',
      });
      return;
    }

    if (car.availabilityStatus === 'unavailable') {
      res.status(400).json({
        success: false,
        message: 'This vehicle is currently unavailable for booking.',
      });
      return;
    }

    const days = Math.max(1, Math.floor(Number(rentalDays)));
    const dailyPrice = car.dailyRentPrice;
    const driverFee = driverNeeded ? 35 * days : 0;
    const totalPrice = dailyPrice * days + driverFee;

    // Never trust client req.body.userEmail - attach authenticated user identity strictly
    const newBooking = await Booking.create({
      userEmail: authUser.email.toLowerCase(),
      userName: authUser.name,
      carId: car._id,
      carName: car.carName,
      carImage: car.imageURL,
      dailyRentPrice: dailyPrice,
      totalPrice,
      rentalDays: days,
      driverNeeded: Boolean(driverNeeded),
      specialNote: typeof specialNote === 'string' ? specialNote.trim() : '',
      bookingDate: new Date(),
    });

    // Increment booking count on vehicle
    await Car.findByIdAndUpdate(car._id, { $inc: { bookingCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Rental booking confirmed successfully!',
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process booking reservation.',
    });
  }
});

// GET /api/bookings/my - Get reservations belonging to the authenticated client
router.get('/my', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const bookings = await Booking.find({ userEmail: authUser.email.toLowerCase() }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your rental bookings.',
    });
  }
});

export default router;
