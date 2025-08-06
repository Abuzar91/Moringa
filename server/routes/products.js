import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

router.post('/', authenticate, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    if (typeof productData.features === 'string') {
      productData.features = productData.features.split(',').map(f => f.trim());
    }

    if (typeof productData.ingredients === 'string') {
      productData.ingredients = productData.ingredients.split(',').map(i => i.trim());
    }

    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map(t => t.trim());
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

router.put('/:id', authenticate, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }

      updateData.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }

    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = updateData.ingredients.split(',').map(i => i.trim());
    }

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status = 'all'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

export default router;