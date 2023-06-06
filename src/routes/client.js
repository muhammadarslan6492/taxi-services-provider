import express from 'express';

// middlewares
import { organization } from '../middlewares/roles';
import auth from '../middlewares/auth';
import validators from '../middlewares/validators';

// controllers
import AdminController from '../controllers/admin';
import ClientController from '../controllers/client';

// main code
const { Router } = express;

const router = Router();

/**
 * @openapi
 * /client:
 *  post:
 *    tags: [Client]
 *    description: api for admin to create client
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: apiKey
 *      - in: body
 *        name: client
 *        schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *             type: string
 *    responses:
 *     200:
 *      description: Return with success message
 *     400:
 *      description: Invalid request
 *     500:
 *      description: Server Error
 *     401:
 *      description: Unauthorized
 *     403:
 *      description: Forbidden
 */
router.post(
  '/',
  auth,
  organization,
  validators.ClientCreationMiddleware,
  AdminController.createClient,
);
/**
 * @openapi
 * /client/login:
 *   post:
 *    tags: [Client]
 *    description: api for client to login
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: credentials
 *        schema:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *            type: string
 *           password:
 *            type: string
 *    responses:
 *       200:
 *        description: Return with success message
 *       400:
 *        description: Invalid request
 *       500:
 *        description: Server Error
 *       401:
 *        description: Unauthorized
 *       403:
 *        description: Forbidden
 *       409:
 *        description: Invalid email or password
 */
router.post(
  '/login',
  ClientController.login,
);

/**
 * @openapi
 * /client/:
 *    put:
 *     tags: [Client]
 *     description: api for client to update their profile
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         type: apiKey
 *       - in: body
 *         name: client
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *      200:
 *       description: Return with success message
 *      500:
 *       description: Server Error
 */
router.put(
  '/',
  auth,
  ClientController.changePassword,
);

/**
 * @openapi
 * /client/:
 *   get:
 *     tags: [Client]
 *     description: api to get all clients
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: apiKey
 *     responses:
 *      200:
 *       description: Return with success message
 *      500:
 *       description: Server Error
 *      401:
 *       description: Unauthorized
 *      403:
 *       description: Forbidden
 */
router.get(
  '/',
  auth,
  ClientController.getCustomers,
);

/**
 * @openapi
 * /client/profile:
 *  get:
 *   tags: [Client]
 *   description: api to get client profile
 *   consumes:
 *     - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *   responses:
 *     200:
 *       description: Return with success message
 *     500:
 *       description: Server Error
 *       schema:
 *        type: object
 *        properties:
 *          msg:
 *           type: string
 *          statusCode:
 *           type: number
 */
router.get(
  '/profile',
  auth,
  ClientController.profile,
);
/**
 * @openapi
 * /client/profile:
 *  put:
 *   tags: [Client]
 *   description: api to update client profile
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: body
 *      name: client
 *      schema:
 *       type: object
 *       properties:
 *        firstName:
 *         type: string
 *        lastName:
 *         type: string
 *       required:
 *        - firstName
 *        - lastName
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put(
  '/profile',
  auth,
  ClientController.setProfile,
);
/**
 * @openapi
 * /client/bookings/history:
 *  get:
 *   tags: [Client]
 *   description: api to get client bookings
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.get(
  '/bookings/history',
  auth,
  ClientController.getBookings,
);

/**
 * @openapi
 * /client/bookings/planning:
 *  get:
 *   tags: [Client]
 *   description: api to get client bookings
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.get(
  '/bookings/planning',
  auth,
  ClientController.getPlanning,
);

/**
 * @openapi
 * /client/bookings:
 *  post:
 *   tags: [Client]
 *   description: api to create client booking
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: body
 *      name: booking
 *      schema:
 *       type: object
 *       properties:
 *        pickup:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          coordinates:
 *           type: array
 *           items:
 *            type: number
 *        noOfPeople:
 *          type: number
 *        carType:
 *          type: string
 *        fare:
 *          type: number
 *        destination:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          coordinates:
 *           type: array
 *           items:
 *            type: number
 *        notes:
 *         type: string
 *        guestName:
 *         type: string
 *        guestPhoneNumber:
 *         type: string
 *        flightNumber:
 *         type: string
 *        paymentType:
 *         type: string
 *        dateTime:
 *         type: string
 *         format: date-time
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.post(
  '/bookings',
  auth,
  ClientController.createBooking,
);
/**
 * @openapi
 * /client/bookings/{bookingId}:
 *  put:
 *   tags: [Client]
 *   description: api to update client booking
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: path
 *      name: bookingId
 *    - in: body
 *      name: booking
 *      schema:
 *       type: object
 *       properties:
 *        pickup:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          coordinates:
 *           type: array
 *           items:
 *            type: number
 *        noOfPeople:
 *          type: number
 *        carType:
 *          type: string
 *        fare:
 *          type: number
 *        destination:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          coordinates:
 *           type: array
 *           items:
 *            type: number
 *        notes:
 *         type: string
 *        guestName:
 *         type: string
 *        guestPhoneNumber:
 *         type: string
 *        flightNumber:
 *         type: string
 *        paymentType:
 *         type: string
 *        dateTime:
 *         type: string
 *         format: date-time
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put(
  '/bookings/:bookingId',
  auth,
  ClientController.updateBooking,
);
/**
 * @openapi
 * /client/dispatcher:
 *  put:
 *   tags: [Client]
 *   description: api to update client dispatcher
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: body
 *      name: object
 *      schema:
 *       type: object
 *       properties:
 *        dispatcherIds:
 *         type: array
 *         items:
 *          type: string
 *        customerId:
 *         type: string
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put(
  '/dispatcher',
  auth,
  ClientController.addDispatcher,
);
/**
 * @openapi
 * /client/dispatcher/{id}:
 *  get:
 *   tags: [Client]
 *   description: api to get client dispatcher
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: path
 *      name: id
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.get(
  '/dispatcher/:id',
  ClientController.getDispatchers,
);

export default router;
