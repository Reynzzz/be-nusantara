const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { eventUpload } = require('../config/multer');

// GET /api/events - Get all events
router.get('/', getAllEvents);

// GET /api/events/:id - Get single event
router.get('/:id', getEventById);

// POST /api/events - Create new event (with image upload)
router.post('/', eventUpload.single('image'), createEvent);

// PUT /api/events/:id - Update event (with optional image upload)
router.put('/:id', eventUpload.single('image'), updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', deleteEvent);

module.exports = router;

