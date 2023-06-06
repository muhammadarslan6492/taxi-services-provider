import express from 'express';
import auth from '../middlewares/auth';
import BookingController from '../controllers/booking';
import { driverDispatcher } from '../middlewares/roles';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /rides/history:
 *  get:
 *      tags: [Rides]
 *      description: api for list ride history
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of history of booking
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              pickup:
 *                type: string
 *              date:
 *                type: string
 *              noOfPeople:
 *                type: number
 *              carType:
 *                type: string
 *              fair:
 *                type: number
 *              destination:
 *                type: string
 *              bookingStatus:
 *                type: string
 *              positions:
 *                type: string
 *              rideEnd:
 *                type: boolean
 *              dispatcherId:
 *                type: string
 *              userId:
 *                type: string
 *              driverId:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/history', auth, BookingController.historyRide);
/**
 * @openapi
 * /rides/planning:
 *  get:
 *      tags: [Rides]
 *      description: api for list ride planing
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of planning of booking
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              pickup:
 *                type: string
 *              dateTime:
 *                type: string
 *              noOfPeople:
 *                type: number
 *              carType:
 *                type: string
 *              fair:
 *                type: number
 *              destination:
 *                type: string
 *              bookingStatus:
 *                type: string
 *              positions:
 *                type: string
 *              rideEnd:
 *                type: boolean
 *              dispatcherId:
 *                type: string
 *              userId:
 *                type: string
 *              driverId:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/planning', auth, BookingController.planingRides);
/**
 * @openapi
 * /rides/assigned:
 *  get:
 *      tags: [Rides]
 *      description: api for list ride planing
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON obj of assigned rides history
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/assigned', auth, BookingController.assigned);
/**
 * @openapi
 * /rides/abort/{id}:
 *  put:
 *   tags: [Rides]
 *   description: api to abort ride
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *    - in: path
 *      name: id
 *      description: ride id
 *      required: true
 *      type: string
 *    - in: body
 *      name: body
 *      description: Abort ride
 *      schema:
 *       type: object
 *       properties:
 *        reason:
 *          type: string
 *        location:
 *          type: object
 *          properties:
 *           lat:
 *            type: number
 *           lng:
 *            type: number
 *        picture:
 *          type: string
 *   responses:
 *     200:
 *      description: success
 *     500:
 *      description: Server Error
 */
router.put('/abort/:id', auth, driverDispatcher, BookingController.abortBooking);
export default router;
