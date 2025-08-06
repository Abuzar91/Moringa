import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous reviews
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ isApproved: 1 });

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const Review = mongoose.model('Review');
    const Product = mongoose.model('Product');
    
    const stats = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const updateData = stats.length > 0 
      ? {
          rating: Math.round(stats[0].averageRating * 10) / 10,
          reviewCount: stats[0].totalReviews
        }
      : {
          rating: 0,
          reviewCount: 0
        };

    await Product.findByIdAndUpdate(productId, updateData);
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

// Update product rating when review is saved
reviewSchema.post('save', async function() {
  await updateProductRating(this.product);
});

// Update product rating when review is updated
reviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await updateProductRating(doc.product);
  }
});

// Update product rating when review is deleted
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await updateProductRating(doc.product);
  }
});

// Also handle deleteOne
reviewSchema.post('deleteOne', { document: true }, async function() {
  await updateProductRating(this.product);
});

export default mongoose.model('Review', reviewSchema);