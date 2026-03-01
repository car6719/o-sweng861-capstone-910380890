import { Router, Request, Response } from 'express';
import { UserModel } from '../models';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get current user profile
router.get('/profile', authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const user = UserModel.findById(authReq.user!.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      studentId: user.studentId,
      hasHold: user.hasHold
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all students (admin only)
router.get('/', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  try {
    const users = UserModel.getAll();
    
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      studentId: user.studentId,
      hasHold: user.hasHold,
      createdAt: user.createdAt
    }));

    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user hold status (admin only)
router.put('/holds/:userId',
  authenticate,
  requireRole('admin'),
  body('hasHold').isBoolean(),
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.userId);
      const { hasHold } = req.body;

      const user = UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      UserModel.updateHold(userId, hasHold);
      res.json({ message: 'Hold status updated successfully' });
    } catch (error) {
      console.error('Update hold error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
