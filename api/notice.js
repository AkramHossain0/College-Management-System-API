import express from 'express';
import {createNotice, getNotices, getNoticeById, updateNotice, deleteNotice } from '../controllers/notice.js';
import checkAdmin from '../middleware/checkAdmin.js';
import checkStudent from '../middleware/checkStudent.js';
import checkTeacher from '../middleware/checkTeacher.js';

const noticeRouter = express.Router();

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

noticeRouter.post('/', checkAdminOrTeacher, createNotice);
noticeRouter.get('/', checkAdminTeacherOrStudent, getNotices);
noticeRouter.get('/:id', checkAdminTeacherOrStudent, getNoticeById);
noticeRouter.put('/:id', checkAdminOrTeacher, updateNotice);
noticeRouter.delete('/:id', checkAdminOrTeacher, deleteNotice);

export default noticeRouter;