import express from 'express';
import auth from '../middlewares/auth';
import { dispatcher } from '../middlewares/roles';
import DispatcherController from '../controllers/dispatcher';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /dispatcher/drivers/all:
 *  get:
 *      tags: [Dispatcher]
 *      description: getting all drivers in dispatcher location
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of drivers
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              displayName:
 *                type: string
 *              fullName:
 *                type: string
 *              email:
 *                type: string
 *              address:
 *                type: string
 *              addressLineTwo:
 *                type: string
 *              postalCode:
 *                type: string
 *              city:
 *                type: string
 *              activeCity:
 *                 type: string
 *              phoneNumber:
 *                type: string
 *              role:
 *                type: string
 *              verified:
 *                type: boolean
 *              block:
 *                type: boolean
 *              status:
 *                type: string
 *              location:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get(
  '/drivers/all',
  auth,
  dispatcher,
  DispatcherController.getDriverInLoc,
);
/**
 * @openapi
 * /dispatcher/booking:
 *  get:
 *      tags: [Dispatcher]
 *      description: getting all booking assign by company
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of bookings
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
router.get('/booking', auth, dispatcher, DispatcherController.getAllBooking);
/**
 * @openapi
 * /dispatcher/assignRide/{id}:
 *  post:
 *      tags: [Dispatcher]
 *      description: assign ride to driver api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *        - in: body
 *          name: bookingId
 *          description: assign ride to driver
 *          schema:
 *            type: object
 *            required:
 *              - bookingId
 *            properties:
 *              bookingId:
 *                type: string
 *      responses:
 *        200:
 *          description: Return with success message
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              success_message:
 *                  type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.post(
  '/assignRide/:id',
  auth,
  dispatcher,
  DispatcherController.assignRide,
);

export default router;
