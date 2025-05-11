import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './libs/db.js';
import { createClient } from 'redis';
import studentRouter from './api/student_auth.js';
import teacherRouter from './api/teacher_auth.js';
import AdminRouter from './api/admin.js';
import teacher_managementRouter from './api/teacher_management.js';
import StudentManagementRouter from './api/student_management.js';
import resultRouter from './api/result.js';
import noticeRouter from './api/notice.js';
import AttendanceRouter from './api/attendance.js';
import dashboardRouter from './api/dashboard.js';


dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379',
});
redisClient.on('connect', () => {
    console.log('Redis client connected');
});
redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

await redisClient.connect();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); 

const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to college management system' });
});

app.use('/api/student', studentRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/teacher-management', teacher_managementRouter);
app.use('/api/student-management', StudentManagementRouter);
app.use('/api/result', resultRouter);
app.use('/api/notice', noticeRouter);
app.use('/api/attendance', AttendanceRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});