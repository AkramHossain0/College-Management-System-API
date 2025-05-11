import express from 'express';
import {resgisterAdmin, loginAdmin} from '../controllers/admin.js';

const AdminRouter = express.Router();

// AdminRouter.post('/register', resgisterAdmin);
AdminRouter.post('/login', loginAdmin);

export default AdminRouter;