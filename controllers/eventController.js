const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || ''; // misal: http://123.45.67.89:3000

// Helper untuk build URL gambar
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${BASE}/uploads/events/${path.basename(imagePath)}`;
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'DESC']]
    });

    const eventsWithUrls = events.map(event => {
      const eventData = event.toJSON();
      eventData.image = getImageUrl(eventData.image);
      return eventData;
    });

    res.json({ success: true, data: eventsWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const eventData = event.toJSON();
    eventData.image = getImageUrl(eventData.image);

    res.json({ success: true, data: eventData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, registration_link } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    const event = await Event.create({ title, description, date, location, registration_link, image: imagePath });
    const eventData = event.toJSON();
    eventData.image = getImageUrl(eventData.image);

    res.status(201).json({ success: true, message: 'Event created successfully', data: eventData });
  } catch (error) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, message: 'Error creating event', error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, registration_link } = req.body;

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    let imagePath = event.image;
    if (req.file) {
      if (event.image && fs.existsSync(event.image)) fs.unlinkSync(event.image);
      imagePath = req.file.path;
    }

    await event.update({ title, description, date, location, registration_link, image: imagePath });
    const eventData = event.toJSON();
    eventData.image = getImageUrl(eventData.image);

    res.json({ success: true, message: 'Event updated successfully', data: eventData });
  } catch (error) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, message: 'Error updating event', error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.image && fs.existsSync(event.image)) fs.unlinkSync(event.image);

    await event.destroy();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
