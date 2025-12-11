const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'DESC']]
    });
    
    // Transform image paths to URLs
    const eventsWithUrls = events.map(event => {
      const eventData = event.toJSON();
      if (eventData.image) {
        eventData.image = `/uploads/events/${path.basename(eventData.image)}`;
      }
      return eventData;
    });
    
    res.json({
      success: true,
      data: eventsWithUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const eventData = event.toJSON();
    if (eventData.image) {
      eventData.image = `/uploads/events/${path.basename(eventData.image)}`;
    }
    
    res.json({
      success: true,
      data: eventData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Get image path from uploaded file
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }
    
    const event = await Event.create({
      title,
      description,
      date,
      location,
      image: imagePath
    });
    
    const eventData = event.toJSON();
    if (eventData.image) {
      eventData.image = `/uploads/events/${path.basename(eventData.image)}`;
    }
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: eventData
    });
  } catch (error) {
    // Delete uploaded file if event creation fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Delete old image if new image is uploaded
    let imagePath = event.image;
    if (req.file) {
      // Delete old image file if exists
      if (event.image && fs.existsSync(event.image)) {
        try {
          fs.unlinkSync(event.image);
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
      imagePath = req.file.path;
    }
    
    await event.update({
      title,
      description,
      date,
      location,
      image: imagePath
    });
    
    const eventData = event.toJSON();
    if (eventData.image) {
      eventData.image = `/uploads/events/${path.basename(eventData.image)}`;
    }
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: eventData
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
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Delete associated image file
    if (event.image && fs.existsSync(event.image)) {
      try {
        fs.unlinkSync(event.image);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    await event.destroy();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

