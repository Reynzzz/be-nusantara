const HomeContent = require('../models/HomeContent');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || '';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') ? imagePath : `${BASE}/uploads/home/${path.basename(imagePath)}`;
};

// Get Home content
const getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = await HomeContent.create({});
    }
    
    const data = content.toJSON();
    data.bg_video = getImageUrl(data.bg_video);
    data.about_image = getImageUrl(data.about_image);
    data.cta_image = getImageUrl(data.cta_image);
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching home content', error: error.message });
  }
};

// Update Home content
const updateHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = await HomeContent.create({});
    }

    const { hero_title, hero_tagline } = req.body;
    let videoPath = content.bg_video;
    let aboutImagePath = content.about_image;
    let ctaImagePath = content.cta_image;

    if (req.files) {
      // Handle Video
      if (req.files.bg_video) {
        if (content.bg_video && fs.existsSync(content.bg_video)) {
          try { fs.unlinkSync(content.bg_video); } catch (e) { console.error(e); }
        }
        videoPath = req.files.bg_video[0].path;
      }
      
      // Handle About Image
      if (req.files.about_image) {
        if (content.about_image && fs.existsSync(content.about_image)) {
          try { fs.unlinkSync(content.about_image); } catch (e) { console.error(e); }
        }
        aboutImagePath = req.files.about_image[0].path;
      }

      // Handle CTA Image
      if (req.files.cta_image) {
        if (content.cta_image && fs.existsSync(content.cta_image)) {
          try { fs.unlinkSync(content.cta_image); } catch (e) { console.error(e); }
        }
        ctaImagePath = req.files.cta_image[0].path;
      }
    }

    await content.update({
      hero_title: hero_title !== undefined ? hero_title : content.hero_title,
      hero_tagline: hero_tagline !== undefined ? hero_tagline : content.hero_tagline,
      bg_video: videoPath,
      about_image: aboutImagePath,
      cta_image: ctaImagePath
    });

    const data = content.toJSON();
    data.bg_video = getImageUrl(data.bg_video);
    data.about_image = getImageUrl(data.about_image);
    data.cta_image = getImageUrl(data.cta_image);

    res.json({ success: true, message: 'Home content updated', data });
  } catch (error) {
    if (req.files) {
        Object.values(req.files).flat().forEach(file => {
             if (file.path && fs.existsSync(file.path)) {
                try { fs.unlinkSync(file.path); } catch (e) { console.error(e); }
            }
        });
    }
    res.status(500).json({ success: false, message: 'Error updating home content', error: error.message });
  }
};

module.exports = {
  getHomeContent,
  updateHomeContent
};
