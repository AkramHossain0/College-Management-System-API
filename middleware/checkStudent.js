import jwt from 'jsonwebtoken';
import StudentAuth from '../model/student_auth.js';

const checkStudent = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7);
    const secretKey = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);

    if (decodedToken.role !== 'student') {
      next(error);
    }

    const student = await StudentAuth.findOne({ email: decodedToken.email });

    if (!student) {
      next(error);
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkStudent;