import express from 'express';
import {
  getSqlLogs,
  createSqlLog,
  updateSqlLog,
  deleteSqlLog,
} from '../controllers/sqlController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getSqlLogs).post(protect, createSqlLog);
router.route('/:id').put(protect, updateSqlLog).delete(protect, deleteSqlLog);

export default router;
