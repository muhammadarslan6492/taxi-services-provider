import express from 'express';
import DriverController from '../controllers/driver';
import { driver, driverDispatcher } from '../middlewares/roles';
import auth from '../middlewares/auth';
import validators from '../middlewares/validators';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /driver/allrides:
 *  get:
 *      tags: [Driver]
 *      description: get Rides
 *      consumes:
 *        - application/json
 *      produces:
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
router.get('/allrides', auth, driver, DriverController.getAllRides);
/**
 * @openapi
 * /driver/booking/{id}:
 *  put:
 *      tags: [Driver]
 *      description: api for accept or reject booking
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
 *              - bookingStatus
 *            properties:
 *              bookingStatus:
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
router.put('/booking/:id', auth, driver, DriverController.rideAR);
/**
 * @openapi
 * /driver/status:
 *  put:
 *      tags: [Driver]
 *      description: api for update their status
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *        - in: body
 *          name: status
 *          description: assign ride to driver
 *          schema:
 *            type: object
 *            required:
 *              - status
 *            properties:
 *              status:
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
router.put(
  '/status',
  auth,
  driverDispatcher,
  validators.DriverStatus,
  DriverController.driverStatus,
);
/**
 * @openapi
 * /driver/upgrade:
 *  post:
 *      tags: [Driver]
 *      description: api for upgrade driver to dispatcher
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *        - in: body
 *          name: status
 *          description: assign ride to driver
 *          schema:
 *            type: object
 *            required:
 *              - amount
 *              - source
 *            properties:
 *              amount:
 *                type: string
 *              source:
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
router.post('/upgrade', auth, driver, DriverController.upgrade);
/**
 * @openapi
 * /driver/startRide/{id}:
 *  put:
 *      tags: [Driver]
 *      description: api for driver for start ride
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
 *          name: ride
 *          description: api for start ride
 *          schema:
 *            type: object
 *            required:
 *              - lat
 *              - lng
 *            properties:
 *              lat:
 *                type: string
 *              lng:
 *                type: string
 *      responses:
 *        200:
 *          description: Return booking object
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.put('/startRide/:id', auth, driverDispatcher, DriverController.startRide);
/**
 * @openapi
 * /driver/ride-in-transit/{id}:
 *  put:
 *   tags: [Driver]
 *   description: api for driver for ride in transit
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      description: ride id
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return booking object
 *    500:
 *     description: Server Error
 */
router.put('/ride-in-transit/:id', auth, driverDispatcher, DriverController.rideInTransit);
/**
 * @openapi
 * /driver/positions/{id}:
 *  put:
 *      tags: [Driver]
 *      description: api for maintain ride position history
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
 *          name: ride
 *          description: api for manage ride positions history
 *          schema:
 *            type: object
 *            required:
 *              - lat
 *              - lng
 *            properties:
 *              lat:
 *                type: string
 *              lng:
 *                type: string
 *      responses:
 *        200:
 *          description: A JSON of ride
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
router.put('/positions/:id', auth, driverDispatcher, DriverController.driverRideLoc);
/**
 * @openapi
 * /driver/ride/end/{id}:
 *  put:
 *      tags: [Driver]
 *      description: api for driver for start ride
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
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
router.put('/ride/end/:id', auth, driverDispatcher, DriverController.rideEnd);
/**
 * @openapi
 * /driver/driver-upgrade-test:
 *  post:
 *      tags: [Driver]
 *      description: driver upgrade api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: Return with driver object
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.post(
  '/driver-upgrade-test',
  auth,
  DriverController.driverUpgradeTest,
);
export default router;
