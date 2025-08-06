import express from 'express';
import mongoose from 'mongoose';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID' 
      });
    }

    let sortOptions = {};
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ 
      product: productId, 
      isApproved: true 
    })
      .populate('user', 'name')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ 
      product: productId, 
      isApproved: true 
    });

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { 
        $match: { 
          product: new mongoose.Types.ObjectId(productId), 
          isApproved: true 
        } 
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Calculate overall statistics
    const overallStats = await Review.aggregate([
      { 
        $match: { 
          product: new mongoose.Types.ObjectId(productId), 
          isApproved: true 
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      ratingStats,
      overallStats: overallStats[0] || { averageRating: 0, totalReviews: 0 }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching reviews' 
    });
  }
});

// Add a review
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { productId, rating, comment, userName, userEmail } = req.body;

    if (!productId || !rating || !comment || !userName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if user already reviewed this product (if logged in)
    if (req.user) {
      const existingReview = await Review.findOne({
        product: productId,
        user: req.user._id
      });

      if (existingReview) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have already reviewed this product' 
        });
      }
    }

    const reviewData = {
      product: productId,
      rating: Number(rating),
      comment,
      userName,
      userEmail: userEmail || req.user?.email
    };

    if (req.user) {
      reviewData.user = req.user._id;
      reviewData.isVerified = true;
    }

    const review = new Review(reviewData);
    await review.save();

    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding review' 
    });
  }
});

// Update a review
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review or is admin
    if (review.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { 
        rating: Number(rating), 
        comment,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating review' 
    });
  }
});

// Delete a review
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review or is admin
    if (review.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting review' 
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', optionalAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // For simplicity, we'll just increment the helpful count
    // In a production app, you'd want to track which users marked it as helpful
    // to prevent multiple votes from the same user
    
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulCount: updatedReview.helpfulCount
    });

  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error marking review as helpful' 
    });
  }
});

// Report a review
router.post('/:id/report', optionalAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { reportCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Review reported successfully',
      reportCount: updatedReview.reportCount
    });

  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error reporting review' 
    });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      rating,
      status = 'all',
      productId
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    if (rating && rating !== 'all') {
      query.rating = Number(rating);
    }

    if (status !== 'all') {
      query.isApproved = status === 'approved';
    }

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid product ID' 
        });
      }
      query.product = productId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find(query)
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching reviews' 
    });
  }
});

// Admin: Update review status
router.put('/admin/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true, runValidators: true }
    ).populate('product', 'name').populate('user', 'name email');

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    res.json({
      success: true,
      message: 'Review status updated successfully',
      review
    });

  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating review status' 
    });
  }
});

export default router;