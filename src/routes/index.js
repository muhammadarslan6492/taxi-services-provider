import express from 'express';
import UserRouter from './users';
import Admin from './admin';
import Company from './company';
import Dispatcher from './dispatcher';
import Driver from './driver';
import ConversationRouter from './conversation';
import MessageRouter from './message';
import BookingRouter from './booking';
import ClientRouter from './client';

const { Router } = express;
const router = Router();
router.use('/user', UserRouter);
router.use('/admin', Admin);
router.use('/company', Company);
router.use('/dispatcher', Dispatcher);
router.use('/driver', Driver);
router.use('/thread', ConversationRouter);
router.use('/message', MessageRouter);
router.use('/rides', BookingRouter);
router.use('/client', ClientRouter);
export default router;
