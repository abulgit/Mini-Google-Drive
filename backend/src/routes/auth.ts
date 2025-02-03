// auth.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth';

const router = Router();
//@ts-ignore
router.post('/register', register);
//@ts-ignore
router.post('/login', login);

export default router;