import express from 'express';
import {getDashboardData} from '../controllers/dashboard.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', getDashboardData);

export default dashboardRouter;