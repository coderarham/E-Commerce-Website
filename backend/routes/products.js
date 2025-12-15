const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
}).fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product with image upload
router.post('/', upload, async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock, collection, originalPrice, discount, features, type, model } = req.body;
    
    console.log('Colors received:', colors);
    
    const imageUrls = [];
    
    // Upload all images to Cloudinary
    console.log('Starting Cloudinary upload process...');
    for (let i = 0; i < 4; i++) {
      const imageField = `image${i}`;
      if (req.files && req.files[imageField] && req.files[imageField][0]) {
        console.log(`Uploading image ${i} to Cloudinary...`);
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) {
                console.error(`Cloudinary upload error for image ${i}:`, error);
                reject(error);
              } else {
                console.log(`✅ Image ${i} uploaded successfully:`, result.secure_url);
                resolve(result);
              }
            }
          ).end(req.files[imageField][0].buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }
    console.log(`Total images uploaded: ${imageUrls.length}`);
    console.log('All image URLs:', imageUrls);
    
    // Require at least one image
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      brand,
      type,
      model,
      sizes: JSON.parse(sizes),
      colors: colors ? JSON.parse(colors) : [],
      image: imageUrls[0], // Main image
      images: imageUrls, // All images array
      stock: Number(stock) || 0,
      collection: collection || 'latest',
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount ? Number(discount) : null,
      features: features ? JSON.parse(features) : []
    });
    
    await product.save();
    console.log('✅ Product saved to MongoDB:', product.name);
    console.log('Product ID:', product._id);
    console.log('Main image URL:', product.image);
    res.status(201).json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', upload, async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock, collection, originalPrice, discount, features, type, model } = req.body;
    
    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      brand,
      type,
      model,
      sizes: JSON.parse(sizes),
      colors: colors ? JSON.parse(colors) : [],
      stock: Number(stock),
      collection: collection || 'latest',
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount ? Number(discount) : null,
      features: features ? JSON.parse(features) : []
    };
    
    // Upload new images if provided
    const imageUrls = [];
    for (let i = 0; i < 4; i++) {
      const imageField = `image${i}`;
      if (req.files && req.files[imageField] && req.files[imageField][0]) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.files[imageField][0].buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }
    
    if (imageUrls.length > 0) {
      updateData.image = imageUrls[0];
      updateData.images = imageUrls;
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  return `ecommerce/products/${publicId}`;
};

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary if exists
    if (product.image) {
      const publicId = getPublicIdFromUrl(product.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting image from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all products
router.delete('/', async (req, res) => {
  try {
    // Get all products to delete their images
    const products = await Product.find({});
    
    // Delete all images from Cloudinary
    for (const product of products) {
      if (product.image) {
        const publicId = getPublicIdFromUrl(product.image);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }
    
    // Delete all products from database
    await Product.deleteMany({});
    res.json({ message: 'All products and images deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;