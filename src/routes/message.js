import express from 'express';
import Message from '../controllers/message';
import auth from '../middlewares/auth';
import { driverDispatcher } from '../middlewares/roles';
import Validators from '../middlewares/validators';

const { MessageValidator } = Validators;

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /message:
 *   post:
 *    tags: [Message]
 *    summary: Create a new message
 *    consumes:
 *     - application/json
 *    parameters:
 *     - in: header
 *       description: Bearer token
 *       name: Authorization
 *       type: apiKey
 *     - in: body
 *       name: body
 *       schema:
 *        type: object
 *        properties:
 *          message:
 *           type: string
 *          threadId:
 *           type: string
 *    responses:
 *     201:
 *      description: Created
 *     500:
 *      description: Internal server error
 */
router.post('/', auth, driverDispatcher, MessageValidator, Message.create);
/**
 * @openapi
 * /message/{id}:
 *  get:
 *   tags: [Message]
 *   summary: Get all messages
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: path
 *      name: id
 *      description: Thread id
 *      type: string
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Internal server error
 */
router.get('/:id', auth, Message.getAll);

export default router;
