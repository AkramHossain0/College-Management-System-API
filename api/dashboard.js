import express from 'express';
import {getDashboardData} from '../controllers/dashboard.js';
import checkTeacher from '../middleware/checkTeacher.js';
import checkStudent from '../middleware/checkStudent.js';
import checkAdmin from '../middleware/checkAdmin.js';

const dashboardRouter = express.Router();

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

dashboardRouter.get('/', checkAdminTeacherOrStudent, getDashboardData);

export default dashboardRouter;