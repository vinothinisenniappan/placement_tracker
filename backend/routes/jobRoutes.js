import express from 'express';
import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getJobApplications).post(protect, createJobApplication);
router
  .route('/:id')
  .put(protect, updateJobApplication)
  .delete(protect, deleteJobApplication);

export default router;
