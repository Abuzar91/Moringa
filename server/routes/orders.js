import express from 'express';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../config/email.js';

const router = express.Router();

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `CG${String(count + 1).padStart(6, '0')}`;
};

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { customerInfo, items, paymentMethod } = req.body;

    if (!customerInfo || !items || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required order information' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'Missing required customer information' });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const processedItem = {
        product: product._id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || ''
        },
        quantity: item.quantity,
        price: product.price
      };

       console.log('Order Debug - Processed item:', processedItem);
       
      processedItems.push(processedItem);
      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const orderNumber = await generateOrderNumber();

    const order = new Order({
      orderNumber,
      customerInfo,
      items: processedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });

    await order.save();

    try {
      await sendOrderConfirmationEmail({
        customerInfo,
        items: processedItems,
        totalAmount,
        orderNumber: order.orderNumber,
        paymentMethod
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.orderStatus,
        customerInfo: {
          fullName: order.customerInfo.fullName,
          email: order.customerInfo.email
        }
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let order = await Order.findOne({ orderNumber: identifier })
      .populate('items.product', 'name images')
      .lean();
    
    if (!order) {
      order = await Order.findById(identifier)
        .populate('items.product', 'name images')
        .lean();
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({ orderNumber })
      .select('orderNumber orderStatus paymentStatus statusHistory totalAmount createdAt customerInfo.fullName')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        customerName: order.customerInfo.fullName,
        statusHistory: order.statusHistory
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: 'Server error tracking order' });
  }
});

router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

router.get('/admin/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        todayOrders: stats[0],
        weekOrders: stats[1],
        monthOrders: stats[2],
        totalOrders: stats[3],
        pendingOrders: stats[4],
        processingOrders: stats[5],
        shippedOrders: stats[6],
        deliveredOrders: stats[7],
        totalRevenue: stats[8][0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

router.put('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, adminNotes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updateData = {};
    
    if (orderStatus && orderStatus !== order.orderStatus) {
      updateData.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        date: new Date(),
        timestamp: new Date(),
        note: adminNotes || `Status updated to ${orderStatus}`
      });
    }
    
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (!orderStatus) {
        order.statusHistory.push({
          status: order.orderStatus,
          date: new Date(),
          timestamp: new Date(),
          note: `Payment status updated to ${paymentStatus}`
        });
      }
    }
    
    if (adminNotes && !orderStatus && !paymentStatus) {
      order.statusHistory.push({
        status: order.orderStatus,
        date: new Date(),
        timestamp: new Date(),
        note: adminNotes
      });
    }

    updateData.statusHistory = order.statusHistory;
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product', 'name images');

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

router.put('/:id/cancel', optionalAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      date: new Date(),
      timestamp: new Date(),
      note: reason || 'Order cancelled'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus
      }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
});

export default router;