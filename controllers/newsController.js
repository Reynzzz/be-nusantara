const News = require('../models/News');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || ''; // misal: http://123.45.67.89:3000

// Helper untuk build URL publik
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') ? imagePath : `${BASE}/uploads/news/${path.basename(imagePath)}`;
};

// Get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({ order: [['date', 'DESC']] });

    const newsWithUrls = news.map(item => {
      const newsData = item.toJSON();
      newsData.image = getImageUrl(newsData.image);
      return newsData;
    });

    res.json({ success: true, data: newsWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
  }
};

// Get single news by ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });

    const newsData = news.toJSON();
    newsData.image = getImageUrl(newsData.image);

    res.json({ success: true, data: newsData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
  }
};

// Create new news
const createNews = async (req, res) => {
  try {
    const { title, excerpt, content, date, external_link } = req.body;

    let imagePath = req.file ? req.file.path : null;

    const news = await News.create({
      title,
      excerpt,
      content,
      external_link,
      image: imagePath,
      date: date || new Date()
    });

    const newsData = news.toJSON();
    newsData.image = getImageUrl(newsData.image);

    res.status(201).json({ success: true, message: 'News created successfully', data: newsData });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error creating news', error: error.message });
  }
};

// Update news
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, date, external_link } = req.body;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });

    let imagePath = news.image;
    if (req.file) {
      if (news.image && fs.existsSync(news.image)) {
        try { fs.unlinkSync(news.image); } catch (unlinkError) { console.error('Error deleting old file:', unlinkError); }
      }
      imagePath = req.file.path;
    }

    await news.update({ title, excerpt, content, image: imagePath, date, external_link });

    const newsData = news.toJSON();
    newsData.image = getImageUrl(newsData.image);

    res.json({ success: true, message: 'News updated successfully', data: newsData });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error updating news', error: error.message });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });

    if (news.image && fs.existsSync(news.image)) {
      try { fs.unlinkSync(news.image); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }

    await news.destroy();
    res.json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting news', error: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
