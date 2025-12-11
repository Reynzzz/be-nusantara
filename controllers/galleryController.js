const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

const mapPathsToUrls = (item) => {
  const data = item.toJSON();

  const normalize = (value) => {
    if (!value) return value;
    // Only prefix local file paths; keep full URLs untouched
    return value.startsWith('http') ? value : `/uploads/gallery/${path.basename(value)}`;
  };

  if (data.type === 'image') {
    data.url = normalize(data.url);
  }

  if (data.thumbnailUrl) {
    data.thumbnailUrl = normalize(data.thumbnailUrl);
  }

  return data;
};

// GET /api/gallery
const getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: items.map(mapPathsToUrls),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery items',
      error: error.message,
    });
  }
};

// GET /api/gallery/:id
const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      data: mapPathsToUrls(item),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item',
      error: error.message,
    });
  }
};

// POST /api/gallery
const createGalleryItem = async (req, res) => {
  try {
    const { title, type, url, thumbnailUrl, description } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title and type are required',
      });
    }

    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be image or video',
      });
    }

    let finalUrl = url;

    if (type === 'image') {
      if (req.file) {
        finalUrl = req.file.path;
      }

      if (!finalUrl) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required for image type',
        });
      }
    } else {
      if (!finalUrl) {
        return res.status(400).json({
          success: false,
          message: 'Video URL is required',
        });
      }
    }

    const item = await Gallery.create({
      title,
      type,
      url: finalUrl,
      thumbnailUrl: thumbnailUrl || null,
      description: description || null,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: mapPathsToUrls(item),
    });
  } catch (error) {
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(400).json({
      success: false,
      message: 'Error creating gallery item',
      error: error.message,
    });
  }
};

// PUT /api/gallery/:id
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, url, thumbnailUrl, description } = req.body;

    const item = await Gallery.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    if (type && !['image', 'video'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be image or video',
      });
    }

    let finalUrl = item.url;
    let finalThumbnail = thumbnailUrl ?? item.thumbnailUrl;
    let finalType = type || item.type;

    if (finalType === 'image') {
      if (!req.file && item.type !== 'image' && !url) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required when changing type to image',
        });
      }
      if (req.file) {
        // remove old file if stored locally
        if (item.url && !item.url.startsWith('http') && fs.existsSync(item.url)) {
          try {
            fs.unlinkSync(item.url);
          } catch (unlinkError) {
            console.error('Error deleting old file:', unlinkError);
          }
        }
        finalUrl = req.file.path;
      } else if (url) {
        finalUrl = url;
      }
    } else {
      // video
      finalUrl = url || item.url;
    }

    await item.update({
      title: title ?? item.title,
      type: finalType,
      url: finalUrl,
      thumbnailUrl: finalThumbnail,
      description: description ?? item.description,
    });

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: mapPathsToUrls(item),
    });
  } catch (error) {
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(400).json({
      success: false,
      message: 'Error updating gallery item',
      error: error.message,
    });
  }
};

// DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    // remove stored files when applicable
    const removeIfLocal = (value) => {
      if (value && !value.startsWith('http') && fs.existsSync(value)) {
        try {
          fs.unlinkSync(value);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    };

    if (item.type === 'image') {
      removeIfLocal(item.url);
    }

    removeIfLocal(item.thumbnailUrl);

    await item.destroy();

    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
      error: error.message,
    });
  }
};

module.exports = {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};


