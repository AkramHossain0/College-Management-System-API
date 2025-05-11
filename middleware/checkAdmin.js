import Admin from '../model/admin.js';
import jwt from 'jsonwebtoken';

const checkAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7);
    const secretKey = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);

    if (decodedToken.role !== 'admin') {
      next(error);
    }

    const admin = await Admin.findOne({ email: decodedToken.email });

    if (!admin) {
      next(error);
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkAdmin;