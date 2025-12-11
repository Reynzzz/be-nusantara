const express = require('express');
const router = express.Router();

const {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

const { galleryUpload } = require('../config/multer');

router.get('/', getAllGallery);
router.get('/:id', getGalleryById);
router.post('/', galleryUpload.single('image'), createGalleryItem);
router.put('/:id', galleryUpload.single('image'), updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

module.exports = router;


