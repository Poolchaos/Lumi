import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  uploadProgressPhoto,
  deleteProgressPhoto,
  getUserPhotos,
} from '../controllers/photoController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upload progress photo (single file upload)
router.post('/upload', upload.single('photo'), uploadProgressPhoto);

// Get user's progress photos
router.get('/', getUserPhotos);

// Delete progress photo (filename passed as query parameter or :0+ for wildcard)
router.delete('/:userId/:photoType/:timestamp', deleteProgressPhoto);

export default router;
