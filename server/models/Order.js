import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: 'Pakistan' }
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productSnapshot: {
      name: String,
      price: Number,
      image: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'easypaisa', 'jazzcash']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingInfo: {
    method: { type: String, default: 'standard' },
    cost: { type: Number, default: 0 },
    estimatedDelivery: Date,
    trackingNumber: String
  },
  notes: String,
  adminNotes: String,
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

orderSchema.pre('save', function(next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.orderStatus,
      date: new Date(),
      timestamp: new Date(),
      note: 'Order placed successfully'
    });
  }
  next();
});

export default mongoose.model('Order', orderSchema);