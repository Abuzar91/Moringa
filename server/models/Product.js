import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['face-cream', 'body-cream', 'anti-aging', 'moisturizer', 'sunscreen', 'night-cream', 'day-cream']
  },
  images: [{
    url: String,
    public_id: String
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  features: [String],
  ingredients: [String],
  skinType: {
    type: String,
    enum: ['all', 'dry', 'oily', 'combination', 'sensitive', 'normal']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  seoTitle: String,
  seoDescription: String,
  tags: [String]
}, {
  timestamps: true
});

productSchema.virtual('discount').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);