const About = require('../models/About');
const path = require('path');
const fs = require('fs');

const parseJsonField = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (error) {
    console.error('Failed to parse JSON field:', error);
    return fallback;
  }
};

// Get about content
const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no content exists, create default
    if (!about) {
      about = await About.create({
        hero_title: '',
        hero_tagline: '',
        history_title: '',
        history_text: '',
        history_image_url: '',
        vision_title: '',
        vision_text: '',
        mission_title: '',
        mission_text: '',
        values: [],
        management: [],
        contact_phone: '',
        contact_email: '',
        contact_address: ''
      });
    }
    
    const aboutData = about.toJSON();
    if (aboutData.history_image_url) {
      aboutData.history_image_url = `/uploads/about/${path.basename(aboutData.history_image_url)}`;
    }
    if (aboutData.management && Array.isArray(aboutData.management)) {
      aboutData.management = aboutData.management.map((item) => ({
        ...item,
        photo_url: item?.photo_url
          ? `/uploads/about/${path.basename(item.photo_url)}`
          : item?.photo_url || null,
      }));
    }
    
    res.json({
      success: true,
      data: aboutData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching about content',
      error: error.message
    });
  }
};

// Update about content
const updateAbout = async (req, res) => {
  try {
    const {
      hero_title,
      hero_tagline,
      history_title,
      history_text,
      vision_title,
      vision_text,
      mission_title,
      mission_text,
      values,
      management,
      contact_phone,
      contact_email,
      contact_address
    } = req.body;
    const managementImageIndexes = req.body.management_image_indexes;
    
    // Get image path from uploaded file (for history_image_url)
    let historyImagePath = null;
    if (req.files && req.files.history_image && req.files.history_image[0]) {
      historyImagePath = req.files.history_image[0].path;
    }
    
    let about = await About.findOne();
    const existingManagement = about?.management || [];
    const parsedValues = parseJsonField(values, about?.values || []);
    const parsedManagement = parseJsonField(management, existingManagement);
    // Merge with existing photo if not provided to keep previously saved path
    let managementData = parsedManagement.map((item, idx) => ({
      ...existingManagement[idx],
      ...item,
    }));
    // Handle management images uploads mapped by provided indexes
    const uploadedManagementImages = (req.files && req.files.management_images) || [];
    const uploadIndexes = Array.isArray(managementImageIndexes)
      ? managementImageIndexes
      : managementImageIndexes
        ? [managementImageIndexes]
        : [];
    uploadedManagementImages.forEach((file, idx) => {
      const targetIndex = Number(uploadIndexes[idx]);
      if (!Number.isNaN(targetIndex) && managementData[targetIndex]) {
        const existingPhotoPath = managementData[targetIndex].photo_url;
        if (existingPhotoPath && fs.existsSync(existingPhotoPath)) {
          try {
            fs.unlinkSync(existingPhotoPath);
          } catch (unlinkError) {
            console.error('Error deleting old management photo:', unlinkError);
          }
        }
        managementData[targetIndex].photo_url = file.path;
      }
    });
    
    if (!about) {
      // Create new if doesn't exist
      about = await About.create({
        hero_title,
        hero_tagline,
        history_title,
        history_text,
        history_image_url: historyImagePath,
        vision_title,
        vision_text,
        mission_title,
        mission_text,
        values: parsedValues || [],
        management: managementData || [],
        contact_phone,
        contact_email,
        contact_address
      });
    } else {
      // Delete old image if new image is uploaded
      if (historyImagePath && about.history_image_url && fs.existsSync(about.history_image_url)) {
        try {
          fs.unlinkSync(about.history_image_url);
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
      
      // Update existing
      await about.update({
        hero_title,
        hero_tagline,
        history_title,
        history_text,
        history_image_url: historyImagePath || about.history_image_url,
        vision_title,
        vision_text,
        mission_title,
        mission_text,
        values: parsedValues || about.values,
        management: managementData || about.management,
        contact_phone,
        contact_email,
        contact_address
      });
    }
    
    const aboutData = about.toJSON();
    if (aboutData.history_image_url) {
      aboutData.history_image_url = `/uploads/about/${path.basename(aboutData.history_image_url)}`;
    }
    if (aboutData.management && Array.isArray(aboutData.management)) {
      aboutData.management = aboutData.management.map((item) => ({
        ...item,
        photo_url: item?.photo_url
          ? `/uploads/about/${path.basename(item.photo_url)}`
          : item?.photo_url || null,
      }));
    }
    
    res.json({
      success: true,
      message: 'About content updated successfully',
      data: aboutData
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.files && req.files.history_image && req.files.history_image[0]) {
      try {
        fs.unlinkSync(req.files.history_image[0].path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    if (req.files && req.files.management_images) {
      req.files.management_images.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting management photo:', unlinkError);
        }
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error updating about content',
      error: error.message
    });
  }
};

module.exports = {
  getAbout,
  updateAbout
};

