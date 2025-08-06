import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// Get active announcement for public display
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    
    const announcement = await Announcement.findOne({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    }).sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error fetching active announcement:', error);
    res.status(500).json({ message: 'Server error fetching announcement' });
  }
});

// Get all announcements (admin only)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      status
    } = req.query;

    const query = {};

    if (search) {
      query.message = { $regex: search, $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      announcements,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error fetching announcements' });
  }
});

// Get single announcement (admin only)
router.get('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Server error fetching announcement' });
  }
});

// Create announcement (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error creating announcement' });
  }
});

// Update announcement (admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Server error updating announcement' });
  }
});

// Delete announcement (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error deleting announcement' });
  }
});

export default router;