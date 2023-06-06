import express from 'express';
import Conversation from '../controllers/conversation';
import auth from '../middlewares/auth';
import { driverDispatcher } from '../middlewares/roles';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /thread:
 *  post:
 *   tags: [Thread]
 *   summary: Create a new thread
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: body
 *      name: body
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *          type: string
 *        receiverId:
 *          type: string
 *   responses:
 *     201:
 *      description: Created
 *     400:
 *      description: Bad Request
 *     500:
 *      description: Internal server error
 */
router.post('/', auth, driverDispatcher, Conversation.create);

/**
 * @openapi
 *  /thread:
 *   get:
 *    tags: [Thread]
 *    summary: Get all threads
 *    consumes:
 *     - application/json
 *    parameters:
 *     - in: header
 *       name: Authorization
 *       description: Bearer token
 *       type: apiKey
 *    responses:
 *     200:
 *      description: Success
 *     500:
 *      description: Internal server error
 */
router.get('/', auth, Conversation.getAll);
/**
 * @openapi
 * /thread/{receiverId}:
 *  get:
 *   tags: [Thread]
 *   summary: find thread
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: path
 *      name: receiverId
 *      description: receiverId
 *      type: string
 *   responses:
 *    200:
 *      description: Success
 *    500:
 *      description: Internal server error
 */
router.get('/:receiverId', auth, Conversation.findThread);

export default router;
