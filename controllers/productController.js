const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || ''; // misal: http://123.45.67.89:3000

// Helper untuk build URL publik
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') ? imagePath : `${BASE}/uploads/products/${path.basename(imagePath)}`;
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    const productsWithUrls = products.map(product => {
      const productData = product.toJSON();
      productData.image = getImageUrl(productData.image);
      return productData;
    });

    res.json({ success: true, data: productsWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const productData = product.toJSON();
    productData.image = getImageUrl(productData.image);

    res.json({ success: true, data: productData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    let imagePath = req.file ? req.file.path : null;

    const product = await Product.create({ name, price, description, category, stock, image: imagePath });

    const productData = product.toJSON();
    productData.image = getImageUrl(productData.image);

    res.status(201).json({ success: true, message: 'Product created successfully', data: productData });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let imagePath = product.image;
    if (req.file) {
      if (product.image && fs.existsSync(product.image)) {
        try { fs.unlinkSync(product.image); } catch (unlinkError) { console.error('Error deleting old file:', unlinkError); }
      }
      imagePath = req.file.path;
    }

    await product.update({ name, price, description, category, stock, image: imagePath });

    const productData = product.toJSON();
    productData.image = getImageUrl(productData.image);

    res.json({ success: true, message: 'Product updated successfully', data: productData });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.image && fs.existsSync(product.image)) {
      try { fs.unlinkSync(product.image); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
