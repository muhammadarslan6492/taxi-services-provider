import express from 'express';
import validators from '../middlewares/validators';
import CompanyController from '../controllers/company';
import auth from '../middlewares/auth';
import { organization, companyDispatcherBooking } from '../middlewares/roles';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /company/booking/create:
 *  post:
 *      tags: [Company]
 *      description: creating booking creating api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: ride
 *          description: required fields for create ride
 *          schema:
 *            type: object
 *            required:
 *              - pickup
 *              - dateTime
 *              - noOfPeople
 *              - destination
 *              - carType
 *              - fare
 *              - guestName
 *              - guestPhoneNumber
 *              - paymentType
 *            properties:
 *              pickup:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  coordinates:
 *                    type: array
 *                    items:
 *                      type: number
 *              destination:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  coordinates:
 *                    type: array
 *                    items:
 *                      type: number
 *              dateTime:
 *                type: string
 *              noOfPeople:
 *                type: number
 *              carType:
 *                type: string
 *              fare:
 *                type: number
 *              guestName:
 *                type: string
 *              guestPhoneNumber:
 *                type: number
 *              paymentType:
 *                type: string
 *              nameCaller:
 *                type: string
 *              flightNumber:
 *                type: string
 *              notes:
 *                type: string
 *              clientId:
 *                type: string
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        201:
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
  '/booking/create',
  auth,
  companyDispatcherBooking,
  validators.BookingMiddleware,
  CompanyController.createRide,
);
/**
 * @openapi
 * /company/booking/all:
 *  get:
 *      tags: [Company]
 *      description: api for get all booking
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of all booking
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
 *              fare:
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
router.get('/booking/all', auth, organization, CompanyController.allBooking);
/**
 * @openapi
 * /company/booking/{id}:
 *  get:
 *      tags: [Company]
 *      description: api for get booking by id
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
 *          description: A JSON object of single booking
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
router.get('/booking/:id', auth, organization, CompanyController.bookingById);
/**
 * @openapi
 * /company/booking/{id}:
 *  put:
 *      tags: [Company]
 *      description: creating booking creating api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          description: required fields for create ride
 *          schema:
 *            type: object
 *            required:
 *              - pickup
 *              - dateTime
 *              - noOfPeople
 *              - carType
 *              - fare
 *              - destination
 *              - guestName
 *              - note
 *              - guestPhoneNumber
 *              - flightNumber
 *              - nameCaller
 *              - paymentType
 *            properties:
 *              pickup:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  coordinates:
 *                    type: array
 *                    items:
 *                      type: number
 *              dateTime:
 *                type: string
 *              noOfPeople:
 *                type: number
 *              carType:
 *                type: string
 *              fare:
 *                type: number
 *              destination:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  coordinates:
 *                    type: array
 *                    items:
 *                      type: number
 *              guestName:
 *                type: string
 *              note:
 *                type: string
 *              guestPhoneNumber:
 *                type: string
 *              flightNumber:
 *                type: string
 *              nameCaller:
 *                type: string
 *              paymentType:
 *                type: string
 *              dispatcherId:
 *                type: string
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
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
  '/booking/:id',
  auth,
  organization,
  validators.BookingMiddleware,
  CompanyController.updateBooking,
);
/**
 * @openapi
 * /company/booking/{id}:
 *  delete:
 *      tags: [Company]
 *      description: api for delete booking
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
router.delete(
  '/booking/:id',
  auth,
  organization,
  CompanyController.deleteBooking,
);
/**
 * @openapi
 * /company/domain:
 *  get:
 *      tags: [Company]
 *      description: api for company to get domain
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
 *          description: Return with the domain of the company
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              domain:
 *                  type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/domain', auth, organization, CompanyController.getDomain);
/**
 * @openapi
 * /company/dispatchers:
 *  get:
 *   tags: [Company]
 *   description: api for company to get all dispatchers
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with the domain of the company
 *    500:
 *     description: Server Error
 */
router.get('/dispatchers', auth, organization, CompanyController.getDispatchers);
export default router;
