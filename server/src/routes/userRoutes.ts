import express, { Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { verifyAuth, AuthenticatedRequest } from '../middleware/verifyAuth';

const router = express.Router();

// GET /api/users/me - Return authenticated user details
router.get('/me', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;

    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        const userDoc = await db.collection('user').findOne({
          email: authUser.email.toLowerCase(),
        });
        if (userDoc) {
          res.status(200).json({
            success: true,
            data: {
              id: userDoc.id || userDoc._id?.toString(),
              name: userDoc.name,
              email: userDoc.email,
              image: userDoc.image,
              createdAt: userDoc.createdAt,
            },
          });
          return;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: authUser,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile information.',
    });
  }
});

// PATCH /api/users/me - Update user display name / photo
router.patch('/me', verifyAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authUser = req.user!;
    const { name, image } = req.body;

    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        const updateFields: any = { updatedAt: new Date() };
        if (name) updateFields.name = name.trim();
        if (image !== undefined) updateFields.image = image;

        await db.collection('user').updateOne(
          { email: authUser.email.toLowerCase() },
          { $set: updateFields }
        );

        res.status(200).json({
          success: true,
          message: 'Profile updated successfully.',
          data: {
            ...authUser,
            ...(name ? { name: name.trim() } : {}),
            ...(image !== undefined ? { image } : {}),
          },
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: authUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
});

export default router;
