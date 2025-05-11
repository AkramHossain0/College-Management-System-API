import jwt from 'jsonwebtoken';
import TeacherAuth from '../model/teacher_auth.js';

const checkTeacher = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7);
    const secretKey = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);

    if (decodedToken.role !== 'teacher') {
      next(error);;
    }

    const teacher = await TeacherAuth.findOne({ email: decodedToken.email });

    if (!teacher) {
      next(error);
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkTeacher;