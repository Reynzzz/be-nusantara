const News = require('../models/News');
const path = require('path');
const fs = require('fs');

// Get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      order: [['date', 'DESC']]
    });
    
    // Transform image paths to URLs
    const newsWithUrls = news.map(item => {
      const newsData = item.toJSON();
      if (newsData.image) {
        newsData.image = `/uploads/news/${path.basename(newsData.image)}`;
      }
      return newsData;
    });
    
    res.json({
      success: true,
      data: newsWithUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

// Get single news by ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    const newsData = news.toJSON();
    if (newsData.image) {
      newsData.image = `/uploads/news/${path.basename(newsData.image)}`;
    }
    
    res.json({
      success: true,
      data: newsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

// Create new news
const createNews = async (req, res) => {
  try {
    const { title, excerpt, content, date } = req.body;
    
    // Get image path from uploaded file
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }
    
    const news = await News.create({
      title,
      excerpt,
      content,
      image: imagePath,
      date: date || new Date()
    });
    
    const newsData = news.toJSON();
    if (newsData.image) {
      newsData.image = `/uploads/news/${path.basename(newsData.image)}`;
    }
    
    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: newsData
    });
  } catch (error) {
    // Delete uploaded file if news creation fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({
      success: false,
      message: 'Error creating news',
      error: error.message
    });
  }
};

// Update news
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, date } = req.body;
    
    const news = await News.findByPk(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    // Delete old image if new image is uploaded
    let imagePath = news.image;
    if (req.file) {
      // Delete old image file if exists
      if (news.image && fs.existsSync(news.image)) {
        try {
          fs.unlinkSync(news.image);
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
      imagePath = req.file.path;
    }
    
    await news.update({
      title,
      excerpt,
      content,
      image: imagePath,
      date
    });
    
    const newsData = news.toJSON();
    if (newsData.image) {
      newsData.image = `/uploads/news/${path.basename(newsData.image)}`;
    }
    
    res.json({
      success: true,
      message: 'News updated successfully',
      data: newsData
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({
      success: false,
      message: 'Error updating news',
      error: error.message
    });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findByPk(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    // Delete associated image file
    if (news.image && fs.existsSync(news.image)) {
      try {
        fs.unlinkSync(news.image);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    await news.destroy();
    
    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message
    });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};

