import express, { Response } from 'express';
import mongoose from 'mongoose';
import { Car } from '../models/Car';
import { verifyAuth, AuthenticatedRequest } from '../middleware/verifyAuth';

const router = express.Router();

// GET /api/cars - List all cars with search, category filtering and sorting
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const { search, type, availability, sort, limit = 50, page = 1 } = req.query;

    const query: any = {};

    if (search && typeof search === 'string' && search.trim()) {
      query.$or = [
        { carName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { pickupLocation: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (type && typeof type === 'string' && type !== 'all') {
      query.carType = type;
    }

    if (availability && typeof availability === 'string' && availability !== 'all') {
      query.availabilityStatus = availability;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { dailyRentPrice: 1 };
    if (sort === 'price_desc') sortOption = { dailyRentPrice: -1 };
    if (sort === 'bookings_desc') sortOption = { bookingCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const cars = await Car.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Car.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      data: cars,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicle fleet from database.',
    });
  }
});

// GET /api/cars/:id - Fetch single vehicle specification
router.get('/:id', async (req, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid vehicle identifier format.',
      });
      return;
    }

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Vehicle listing not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error('Error fetching car details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle specification.',
    });
  }
});

// POST /api/cars - Host adds new vehicle listing (Strict Authentication & Server-Side Ownership)
router.post('/', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const {
      carName,
      dailyRentPrice,
      carType,
      imageURL,
      seatCapacity,
      pickupLocation,
      description,
      availabilityStatus = 'available',
    } = req.body;

    if (!carName || !dailyRentPrice || !carType || !imageURL || !seatCapacity || !pickupLocation || !description) {
      res.status(400).json({
        success: false,
        message: 'All vehicle fields are required.',
      });
      return;
    }

    // Server authoritative owner identity - Never trust client-supplied ownerEmail
    const newCar = await Car.create({
      carName: carName.trim(),
      dailyRentPrice: Number(dailyRentPrice),
      carType,
      imageURL: imageURL.trim(),
      seatCapacity: Number(seatCapacity),
      pickupLocation: pickupLocation.trim(),
      description: description.trim(),
      availabilityStatus,
      ownerEmail: authUser.email.toLowerCase(),
      ownerName: authUser.name,
      ownerPhoto: authUser.image || '',
      bookingCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle listing published successfully.',
      data: newCar,
    });
  } catch (error) {
    console.error('Error creating car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save vehicle listing to MongoDB Atlas.',
    });
  }
});

// PATCH /api/cars/:id - Update vehicle (Protected: Owner authorization enforced)
router.patch('/:id', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid vehicle identifier format.',
      });
      return;
    }

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Vehicle listing not found.',
      });
      return;
    }

    // Strict host authorization verification
    if (car.ownerEmail.toLowerCase() !== authUser.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only modify vehicles you have personally listed.',
      });
      return;
    }

    const updatableFields = [
      'carName',
      'dailyRentPrice',
      'carType',
      'imageURL',
      'seatCapacity',
      'pickupLocation',
      'description',
      'availabilityStatus',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (car as any)[field] = req.body[field];
      }
    });

    await car.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle details updated successfully.',
      data: car,
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle record.',
    });
  }
});

// DELETE /api/cars/:id - Remove listing (Protected: Owner authorization enforced)
router.delete('/:id', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid vehicle identifier format.',
      });
      return;
    }

    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Vehicle listing not found.',
      });
      return;
    }

    // Strict host authorization check
    if (car.ownerEmail.toLowerCase() !== authUser.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete vehicles you have personally listed.',
      });
      return;
    }

    await Car.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Vehicle listing deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle listing from database.',
    });
  }
});

export default router;
