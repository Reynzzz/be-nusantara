const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/home';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.get('/', homeController.getHomeContent);
router.put('/', upload.fields([
    { name: 'bg_video', maxCount: 1 },
    { name: 'about_image', maxCount: 1 },
    { name: 'cta_image', maxCount: 1 }
]), homeController.updateHomeContent);

module.exports = router;
