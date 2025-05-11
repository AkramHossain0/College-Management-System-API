import express from 'express';
import { addAttendance,
    getAllAttendance,
    getAttendanceByStudentId,
    getAttendanceByDate,
    updateAttendance,
    deleteAttendance } from '../controllers/attendance.js';

const AttendanceRouter = express.Router();

AttendanceRouter.post('/add', addAttendance);
AttendanceRouter.get('/all', getAllAttendance);
AttendanceRouter.get('/student/:studentId', getAttendanceByStudentId);
AttendanceRouter.get('/date/:date', getAttendanceByDate);
AttendanceRouter.put('/update/:id', updateAttendance);
AttendanceRouter.delete('/delete/:id', deleteAttendance);

export default AttendanceRouter;