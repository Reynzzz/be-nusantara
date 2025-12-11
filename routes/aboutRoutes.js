const express = require('express');
const router = express.Router();
const {
  getAbout,
  updateAbout
} = require('../controllers/aboutController');
const { aboutUpload } = require('../config/multer');

// GET /api/about - Get about content
router.get('/', getAbout);

// PUT /api/about - Update about content (with optional history & management images)
router.put(
  '/',
  aboutUpload.fields([
    { name: 'history_image', maxCount: 1 },
    { name: 'management_images', maxCount: 50 },
  ]),
  updateAbout
);

module.exports = router;

