const About = require('../models/About');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL; // gunakan domain/IP VPS

const parseJsonField = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (error) {
    console.error('Failed to parse JSON field:', error);
    return fallback;
  }
};

const buildUrl = (folder, filename) => {
  if (!filename) return null;
  return `${BASE}/uploads/${folder}/${filename}`;
};

// Get about content
const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

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

    const data = about.toJSON();

    // Ganti path menjadi URL lengkap
    if (data.history_image_url) {
      data.history_image_url = buildUrl(
        'about',
        path.basename(data.history_image_url)
      );
    }

    if (Array.isArray(data.management)) {
      data.management = data.management.map(m => ({
        ...m,
        photo_url: m?.photo_url
          ? buildUrl('about', path.basename(m.photo_url))
          : null
      }));
    }

    res.json({ success: true, data });
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
    const body = req.body;
    const imageIndexes = body.management_image_indexes;

    let about = await About.findOne();
    const existingManagement = about?.management || [];

    const parsedValues = parseJsonField(body.values, about?.values);
    const parsedManagement = parseJsonField(body.management, existingManagement);

    // Merge management data
    let managementData = parsedManagement.map((item, i) => ({
      ...existingManagement[i],
      ...item,
    }));

    // Upload history image
    let historyImagePath = about?.history_image_url;
    if (req.files?.history_image?.[0]) {
      const file = req.files.history_image[0];

      // delete old file
      if (historyImagePath && fs.existsSync(historyImagePath)) {
        try { fs.unlinkSync(historyImagePath); } catch {}
      }
      historyImagePath = file.path;
    }

    // Upload management images
    const uploadedManagement = req.files?.management_images || [];
    const uploadIndexes = Array.isArray(imageIndexes)
      ? imageIndexes
      : imageIndexes
        ? [imageIndexes]
        : [];

    uploadedManagement.forEach((file, idx) => {
      const targetIndex = Number(uploadIndexes[idx]);
      if (!isNaN(targetIndex) && managementData[targetIndex]) {
        const old = managementData[targetIndex].photo_url;
        if (old && fs.existsSync(old)) {
          try { fs.unlinkSync(old); } catch {}
        }
        managementData[targetIndex].photo_url = file.path;
      }
    });

    // Create new or update
    if (!about) {
      about = await About.create({
        ...body,
        values: parsedValues,
        management: managementData,
        history_image_url: historyImagePath,
      });
    } else {
      await about.update({
        ...body,
        values: parsedValues,
        management: managementData,
        history_image_url: historyImagePath,
      });
    }

    // Convert response paths → URL lengkap
    const data = about.toJSON();

    if (data.history_image_url) {
      data.history_image_url = buildUrl('about', path.basename(data.history_image_url));
    }

    if (Array.isArray(data.management)) {
      data.management = data.management.map(item => ({
        ...item,
        photo_url: item?.photo_url
          ? buildUrl('about', path.basename(item.photo_url))
          : null,
      }));
    }

    res.json({
      success: true,
      message: 'About content updated successfully',
      data
    });

  } catch (error) {
    // cleanup uploaded files
    if (req.files?.history_image?.[0]) {
      try { fs.unlinkSync(req.files.history_image[0].path); } catch {}
    }
    if (req.files?.management_images) {
      req.files.management_images.forEach(file => {
        try { fs.unlinkSync(file.path); } catch {}
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating about content',
      error: error.message
    });
  }
};

module.exports = { getAbout, updateAbout };
