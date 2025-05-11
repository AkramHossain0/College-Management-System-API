import express from 'express';
import {teacherRegister, verifyEmail, teacherLogin, teacherForgotPassword, teacherResetPassword} from '../controllers/teacher_auth.js';

const teacherRouter = express.Router();

teacherRouter.post('/register', teacherRegister);
teacherRouter.post('/verify', verifyEmail);
teacherRouter.post('/login', teacherLogin);
teacherRouter.post('/forgot-password', teacherForgotPassword);
teacherRouter.post('/reset-password', teacherResetPassword);

export default teacherRouter;