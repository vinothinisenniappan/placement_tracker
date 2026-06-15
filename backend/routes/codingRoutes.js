import express from 'express';
import {
  getCodingLogs,
  createCodingLog,
  updateCodingLog,
  deleteCodingLog,
} from '../controllers/codingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCodingLogs).post(protect, createCodingLog);
router.route('/:id').put(protect, updateCodingLog).delete(protect, deleteCodingLog);

export default router;
