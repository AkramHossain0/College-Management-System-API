import express from 'express';
import checkAdmin from '../middleware/checkAdmin.js';
import checkTeacher from '../middleware/checkTeacher.js';
import checkStudent from '../middleware/checkStudent.js';
import { addResult, getResult, updateResult, deleteResult } from '../controllers/result.js';

const resultRouter = express.Router();

const checkAdminOrTeacher = (req, res, next) => {
    checkAdmin(req, res, (err) => {
        if (err) {
            checkTeacher(req, res, (err) => {
                if (err) {
                    return res.status(403).json({ message: 'Access denied. Admins or teachers only.' });
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    });
};

const checkAdminTeacherOrStudent = (req, res, next) => {
    checkAdmin(req, res, (err) => {
        if (err) {
            checkTeacher(req, res, (err) => {
                if (err) {
                    checkStudent(req, res, (err) => {
                        if (err) {
                            return res.status(403).json({ message: 'Access denied. Admins, teachers, or students only.' });
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    });
};

resultRouter.post('/', checkAdminOrTeacher, addResult);
resultRouter.get('/:studentId',checkAdminTeacherOrStudent, getResult);
resultRouter.get('/',checkAdminTeacherOrStudent, getResult);
resultRouter.put('/:id',checkAdminOrTeacher, updateResult);
resultRouter.delete('/:id',checkAdminOrTeacher, deleteResult);

export default resultRouter;