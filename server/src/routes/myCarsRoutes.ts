import express, { Response } from 'express';
import { Car } from '../models/Car';
import { verifyAuth, AuthenticatedRequest } from '../middleware/verifyAuth';

const router = express.Router();

// GET /api/my-cars - Get cars listed by the authenticated host
router.get('/', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const cars = await Car.find({ ownerEmail: authUser.email.toLowerCase() }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error('Error fetching host vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your car fleet from database.',
    });
  }
});

export default router;
