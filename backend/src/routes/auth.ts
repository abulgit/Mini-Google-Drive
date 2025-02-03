// auth.ts
import { Router } from 'express';
import { googleLogin } from '../controllers/auth';

const router = Router();
// //@ts-ignore
// router.post('/register', register);
// //@ts-ignore
// router.post('/login', login);
router.post('/google', googleLogin);

export default router;