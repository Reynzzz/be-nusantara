const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { newsUpload } = require('../config/multer');

// GET /api/news - Get all news
router.get('/', getAllNews);

// GET /api/news/:id - Get single news
router.get('/:id', getNewsById);

// POST /api/news - Create new news (with image upload)
router.post('/', newsUpload.single('image'), createNews);

// PUT /api/news/:id - Update news (with optional image upload)
router.put('/:id', newsUpload.single('image'), updateNews);

// DELETE /api/news/:id - Delete news
router.delete('/:id', deleteNews);

module.exports = router;

