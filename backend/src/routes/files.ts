// files.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getAuthParams, saveFile, getFiles, deleteFile, getStorageStats} from '../controllers/files';

const router = Router();
//@ts-ignore
router.get('/auth', authenticate, getAuthParams);
//@ts-ignore
router.post('/', authenticate, saveFile);
//@ts-ignore
router.get('/', authenticate, getFiles);
//@ts-ignore
router.delete('/:id', authenticate, deleteFile);
//@ts-ignore
router.get('/storage', authenticate, getStorageStats);

export default router;