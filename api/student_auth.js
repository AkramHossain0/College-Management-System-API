import express from 'express';
import { studentRegister, studentLogin, verifyEmail, studentForgotPassword, studentResetPassword } from '../controllers/student_auth.js';

const studentRouter = express.Router();

studentRouter.post('/register', studentRegister);
studentRouter.post('/login', studentLogin);
studentRouter.post('/verify-email', verifyEmail);
studentRouter.post('/forgot-password', studentForgotPassword);
studentRouter.post('/reset-password', studentResetPassword);

export default studentRouter;