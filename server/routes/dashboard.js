import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalOrders, totalProducts, totalUsers, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.distinct('customerInfo.email').then(emails => emails.length),
      Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const [recentOrders, recentRevenue] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { 
          $match: { 
            orderStatus: 'delivered',
            createdAt: { $gte: startDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
    ]);

    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentMethodStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: '$product.name',
          image: { $arrayElemAt: ['$product.images.url', 0] },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    const recentOrdersList = await Order.find()
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      stats: {
        overview: {
          totalOrders,
          totalProducts,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0,
          recentOrders,
          recentRevenue: recentRevenue[0]?.total || 0,
        },
        orderStatusStats,
        paymentMethodStats,
        dailySales,
        topProducts,
        recentOrders: recentOrdersList
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

router.get('/analytics', authenticate, adminOnly, async (req, res) => {
  try {
    const { type = 'monthly', year = new Date().getFullYear() } = req.query;
    
    let groupBy;
    let sortBy;
    
    if (type === 'daily') {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
      
    } else if (type === 'monthly') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      sortBy = { '_id.year': 1, '_id.month': 1 };
      
    } else {
      groupBy = {
        year: { $year: '$createdAt' }
      };
      sortBy = { '_id.year': 1 };
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrder: { $avg: '$totalAmount' }
        }
      },
      { $sort: sortBy }
    ]);

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

export default router;