const express = require('express');
const router = express.Router();
const {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone
} = require('../controllers/milestoneController');
const { milestoneUpload } = require('../config/multer');

router.get('/', getAllMilestones);
router.get('/:id', getMilestoneById);
router.post('/', milestoneUpload.single('image'), createMilestone);
router.put('/:id', milestoneUpload.single('image'), updateMilestone);
router.delete('/:id', deleteMilestone);

module.exports = router;


