import express from 'express';
import { addTeacher, updateTeacher, deleteTeacher, getTeacher } from '../controllers/teacher_management.js';

const TeacherManagementRouter = express.Router();

TeacherManagementRouter.post('/add-teacher', addTeacher);
TeacherManagementRouter.put('/update-teacher/:id', updateTeacher);
TeacherManagementRouter.delete('/delete-teacher/"id', deleteTeacher);
TeacherManagementRouter.get('/', getTeacher);

export default TeacherManagementRouter;