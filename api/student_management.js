import express from 'express';
import {newStudent, getStudent, updateStudent, deleteStudent} from '../controllers/student_management.js';

const StudentManagementRouter = express.Router();

StudentManagementRouter.post('/new-student', newStudent);
StudentManagementRouter.get('/', getStudent);
StudentManagementRouter.put('/update-student/:id', updateStudent);
StudentManagementRouter.delete('/delete-student/:id', deleteStudent);

export default StudentManagementRouter;