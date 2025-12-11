const Milestone = require('../models/Milestone');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || ''; // misal: http://123.45.67.89:3000

const normalizeAchievements = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
  } catch (err) {}
  if (typeof value === 'string') {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

// Helper untuk ubah path menjadi URL publik
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') ? imagePath : `${BASE}/uploads/milestones/${path.basename(imagePath)}`;
};

// Get all milestones
const getAllMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.findAll({ order: [['year', 'DESC']] });
    const normalized = milestones.map(item => {
      const data = item.toJSON();
      data.image = getImageUrl(data.image);
      return data;
    });
    res.json({ success: true, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching milestones', error: error.message });
  }
};

// Get milestone by id
const getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    const data = milestone.toJSON();
    data.image = getImageUrl(data.image);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching milestone', error: error.message });
  }
};

// Create milestone
const createMilestone = async (req, res) => {
  try {
    const { year, title, description, achievements } = req.body;
    const parsedAchievements = normalizeAchievements(achievements);

    let imagePath = req.file ? req.file.path : null;

    const milestone = await Milestone.create({ year, title, description, achievements: parsedAchievements, image: imagePath });

    const data = milestone.toJSON();
    data.image = getImageUrl(data.image);

    res.status(201).json({ success: true, message: 'Milestone created successfully', data });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error creating milestone', error: error.message });
  }
};

// Update milestone
const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, description, achievements } = req.body;
    const parsedAchievements = normalizeAchievements(achievements);

    const milestone = await Milestone.findByPk(id);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    let imagePath = milestone.image;
    if (req.file) {
      if (milestone.image && fs.existsSync(milestone.image)) {
        try { fs.unlinkSync(milestone.image); } catch (unlinkError) { console.error('Error deleting old file:', unlinkError); }
      }
      imagePath = req.file.path;
    }

    await milestone.update({ year, title, description, achievements: parsedAchievements, image: imagePath });

    const data = milestone.toJSON();
    data.image = getImageUrl(data.image);

    res.json({ success: true, message: 'Milestone updated successfully', data });
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }
    res.status(400).json({ success: false, message: 'Error updating milestone', error: error.message });
  }
};

// Delete milestone
const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    if (milestone.image && fs.existsSync(milestone.image)) {
      try { fs.unlinkSync(milestone.image); } catch (unlinkError) { console.error('Error deleting file:', unlinkError); }
    }

    await milestone.destroy();
    res.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting milestone', error: error.message });
  }
};

module.exports = {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone
};
