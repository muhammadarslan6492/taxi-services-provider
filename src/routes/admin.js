import express from 'express';
import AdminController from '../controllers/admin';
import { superAdmin } from '../middlewares/roles';
import auth from '../middlewares/auth';
import BrandController from '../controllers/brand';
import validators from '../middlewares/validators';
import CarController from '../controllers/car';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /admin/driver/allOnboarding:
 *  get:
 *      tags: [Admin]
 *      description: get onboarding
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: query
 *          name: verify
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object containing brand info
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              numberPlate:
 *                  type: string
 *              insuranceDocument:
 *                  type: object
 *                  properties:
 *                    expiry:
 *                      type: string
 *                    image:
 *                      type: string
 *              licenseCard:
 *                  type: object
 *                  properties:
 *                    expiry:
 *                      type: string
 *                    frontImage:
 *                      type: string
 *                    backImage:
 *                      type: string
 *              vehicleCard:
 *                  type: object
 *                  properties:
 *                    expiry:
 *                      type: string
 *                    frontImage:
 *                      type: string
 *                    backImage:
 *                      type: string
 *              pictures:
 *                  type: object
 *                  properties:
 *                    frontImage:
 *                      type: string
 *                    backImage:
 *                      type: string
 *                    sideImage:
 *                      type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get(
  '/driver/allOnboarding',
  auth,
  superAdmin,
  AdminController.allOnBoarding,
);
/**
 * @openapi
 * /admin/driver/verify/{id}:
 *  put:
 *      tags: [Admin]
 *      description: getting onBoarding verifying by id api
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
router.put('/driver/verify/:id', auth, superAdmin, AdminController.verify);
/**
 * @openapi
 * /admin/driver/reject/{id}:
 *  put:
 *      tags: [Admin]
 *      description: getting onBoarding verifying by id api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          name: onboarding
 *          description: api for admin for reject onBoarding
 *          schema:
 *            type: object
 *            required:
 *              - reason
 *            properties:
 *              reason:
 *                type: string
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: Return the reject message
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.put(
  '/driver/reject/:id',
  auth,
  superAdmin,
  validators.RejectByAdminMiddleware,
  AdminController.reject,
);
/**
 * @openapi
 * /admin/brand/create:
 *  post:
 *      tags: [Admin]
 *      description: creating brand api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: brand
 *          description: required fields for mobile create brand
 *          schema:
 *            type: object
 *            required:
 *              - brandName
 *            properties:
 *              brandName:
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
  '/brand/create',
  auth,
  superAdmin,
  validators.BrandMiddleware,
  BrandController.createBrand,
);
/**
 * @openapi
 * /admin/brand/all:
 *  get:
 *      tags: [Admin]
 *      description: getting All brand info api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object containing brand info
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              brandName:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/brand/all', auth, superAdmin, BrandController.allBrands);
/**
 * @openapi
 * /admin/brand/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting brand by id api
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
 *          description: A JSON object containing sigle brand info
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              brandName:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/brand/:id', auth, superAdmin, BrandController.getBrand);
/**
 * @openapi
 * /admin/brand/{id}:
 *  put:
 *      tags: [Admin]
 *      description: Update brand info api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          name: car
 *          description: required fields for mobile brand
 *          schema:
 *            type: object
 *            required:
 *              - brandName
 *            properties:
 *              brandName:
 *                type: string
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
router.put(
  '/brand/:id',
  auth,
  superAdmin,
  validators.BrandMiddleware,
  BrandController.updateBrand,
);
/**
 * @openapi
 * /admin/brand/{id}:
 *  delete:
 *      tags: [Admin]
 *      description: delete brand info api
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
router.delete('/brand/:id', auth, superAdmin, BrandController.deletaBrand);
/**
 * @openapi
 * /admin/car/create:
 *  post:
 *      tags: [Admin]
 *      description: creating car api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: car
 *          description: required fields for mobile create car
 *          schema:
 *            type: object
 *            required:
 *              - carName
 *              - category
 *              - seatingCapacity
 *              - year
 *              - brandId
 *            properties:
 *              carName:
 *                type: string
 *              seatingCapacity:
 *                type: integer
 *              category:
 *                type: string
 *              year:
 *                type: integer
 *              brandId:
 *                type: string
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        201:
 *          description: Returns object of created car
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.post(
  '/car/create',
  auth,
  superAdmin,
  validators.CarMiddleware,
  CarController.createCar,
);
/**
 * @openapi
 * /admin/car/all:
 *  get:
 *      tags: [Admin]
 *      description: getting car by id api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of cars
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              carName:
 *                type: string
 *              category:
 *                type: string
 *              seatingCapacity:
 *                type: integer
 *              year:
 *                type: integer
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/car/all', auth, superAdmin, CarController.allCar);
/**
 * @openapi
 * /admin/car/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting car by id api
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
 *          description: A JSON object of car
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              carName:
 *                type: string
 *              category:
 *                type: string
 *              seatingCapacity:
 *                type: integer
 *              year:
 *                type: integer
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/car/:id', auth, superAdmin, CarController.getCar);
/**
 * @openapi
 * /admin/car/{id}:
 *  put:
 *      tags: [Admin]
 *      description: Update car info api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          name: car
 *          description: required fields for mobile car
 *          schema:
 *            type: object
 *            required:
 *              - carName
 *              - category
 *              - seatingCapacity
 *              - year
 *              - brandId
 *            properties:
 *              carName:
 *                type: string
 *              category:
 *                type: string
 *              seatingCapacity:
 *                type: integer
 *              year:
 *                type: integer
 *              brandId:
 *                type: string
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
router.put(
  '/car/:id',
  auth,
  superAdmin,
  validators.CarUpdateMiddleware,
  CarController.updateCar,
);
/**
 * @openapi
 * /admin/car/{id}:
 *  delete:
 *      tags: [Admin]
 *      description: delete car info api
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
router.delete('/car/:id', auth, superAdmin, CarController.deletaCar);
/**
 * @openapi
 * /admin/company/create:
 *  post:
 *      tags: [Admin]
 *      description: Signup Api for admin to create company
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          description: required fields for update company
 *          schema:
 *            type: object
 *            required:
 *              - displayName
 *              - email
 *              - password
 *              - companyName
 *              - country
 *              - city
 *              - address
 *              - postalCode
 *              - activeCity
 *              - IBAN
 *            properties:
 *              displayName:
 *                type: string
 *              IBAN:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              companyName:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              activeCity:
 *                 type: string
 *              address:
 *                type: string
 *              addressLineTwo:
 *                type: string
 *              postalCode:
 *                type: string
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
router.post(
  '/company/create',
  auth,
  superAdmin,
  validators.WebSignupMiddleware,
  AdminController.createCompany,
);
/**
 * @openapi
 * /admin/company/all:
 *  get:
 *      tags: [Admin]
 *      description: getting All companies info api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object containing info of all companies
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              displayName:
 *                type: string
 *              IBAN:
 *                type: string
 *              email:
 *                type: string
 *              companyName:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              activeCity:
 *                 type: string
 *              address:
 *                type: string
 *              addressLineTwo:
 *                type: string
 *              postalCode:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/company/all', auth, superAdmin, AdminController.getCompanies);
/**
 * @openapi
 * /admin/company/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting All companies info api
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
 *          description: A JSON object containing info company
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              displayName:
 *                type: string
 *              IBAN:
 *                type: string
 *              email:
 *                type: string
 *              companyName:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              activeCity:
 *                 type: string
 *              address:
 *                type: string
 *              addressLineTwo:
 *                type: string
 *              postalCode:
 *                type: string
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/company/:id', auth, superAdmin, AdminController.getCompany);
/**
 * @openapi
 * /admin/company/{id}:
 *  put:
 *      tags: [Admin]
 *      description: Signup Api for admin to update company
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          description: required fields for update company
 *          schema:
 *            type: object
 *            required:
 *              - displayName
 *              - country
 *              - city
 *              - address
 *              - postalCode
 *              - activeCity
 *              - IBAN
 *            properties:
 *              displayName:
 *                type: string
 *              IBAN:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              activeCity:
 *                 type: string
 *              address:
 *                type: string
 *              postalCode:
 *                type: string
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: Return with company object
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.put('/company/:id', auth, superAdmin, validators.CompanyUpdateMiddleware, AdminController.updateCompany);
/**
 * @openapi
 * /admin/company/{id}:
 *  delete:
 *      tags: [Admin]
 *      description: delete company info api
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
router.delete('/company/:id', auth, superAdmin, AdminController.deleteCompany);
/**
 * @openapi
 * /admin/dispatcher/all:
 *  get:
 *      tags: [Admin]
 *      description: get dispatchers
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
 *          description: A JSON object of dispatcher
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
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get(
  '/dispatcher/all',
  auth,
  superAdmin,
  AdminController.getAllDispatcher,
);
/**
 * @openapi
 * /admin/dispatcher/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for admin to assign network
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
 *          description: assign ride to driver
 *          schema:
 *            type: object
 *            required:
 *              - activeCity
 *            properties:
 *              activeCity:
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
router.put('/dispatcher/:id', auth, superAdmin, AdminController.assignlocation);
/**
 * @openapi
 * /admin/dispatcher/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting dispatcher info by id api
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
 *          description: A JSON object of dispatcher
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
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/dispatcher/:id', auth, superAdmin, AdminController.dispatcherByID);
/**
 * @openapi
 * /admin/vehicleList:
 *  get:
 *      tags: [Admin]
 *      description: get vehicle List
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
 *          description: Returns object of vehicleList
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/vehicleList', auth, AdminController.completeVehicleList);
/**
 * @openapi
 * /admin/drivers:
 *  get:
 *      tags: [Admin]
 *      description: get Drivers List
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
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/drivers', auth, superAdmin, AdminController.getDrivers);
/**
 * @openapi
 * /admin/drivers/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting driver info by id api
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
 *          description: A JSON object of driver
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
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/drivers/:id', auth, superAdmin, AdminController.getDriver);
/**
 * @openapi
 * /admin/booking:
 *  get:
 *      tags: [Admin]
 *      description: get booking List
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: query
 *          name: bookingStatus
 *        - in: header
 *          name: Authorization
 *          description: Bearer token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object of booking
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
router.get('/booking', auth, superAdmin, AdminController.getBookings);
/**
 * @openapi
 * /admin/booking/{id}:
 *  get:
 *      tags: [Admin]
 *      description: getting booking by id
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
router.get('/booking/:id', auth, superAdmin, AdminController.getBookingById);
/**
 * @openapi
 * /admin/dispatcher/block/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for block dispatcher
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
router.put('/dispatcher/block/:id', auth, superAdmin, AdminController.block);
/**
 * @openapi
 * /admin/dispatcher/unblock/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for unblock dispatcher
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
router.put(
  '/dispatcher/unblock/:id',
  auth,
  superAdmin,
  AdminController.unBlock,
);
/**
 * @openapi
 * /admin/dispatcher/{id}:
 *  delete:
 *      tags: [Admin]
 *      description: api for delete dispatcher
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
  '/dispatcher/:id',
  auth,
  superAdmin,
  AdminController.deleteDispatcher,
);
/**
 * @openapi
 * /admin/driver/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for admin to assign location and dispatcher to driver
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
 *          name: location
 *          description: assign ride to driver
 *          schema:
 *            type: object
 *            required:
 *              - activeCity
 *              - userId
 *            properties:
 *              activeCity:
 *                type: string
 *              userId:
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
router.put('/driver/:id', auth, superAdmin, AdminController.updateDriver);
/**
 * @openapi
 * /admin/driver/block/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for block driver
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
router.put('/driver/block/:id', auth, superAdmin, AdminController.blockDriver);
/**
 * @openapi
 * /admin/driver/unblock/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for unblock driver
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
router.put(
  '/driver/unblock/:id',
  auth,
  superAdmin,
  AdminController.unBlockDriver,
);
/**
 * @openapi
 * /admin/driver/{id}:
 *  delete:
 *      tags: [Admin]
 *      description: api for delete driver
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
router.delete('/driver/:id', auth, superAdmin, AdminController.deleteDriver);
/**
 * @openapi
 * /admin/company/domain/{id}:
 *  get:
 *      tags: [Admin]
 *      description: api for adim to get company domain
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
router.get(
  '/company/domain/:id',
  auth,
  superAdmin,
  AdminController.getCompanyDomain,
);
/**
 * @openapi
 * /admin/driver-upgrade/{id}:
 *  put:
 *      tags: [Admin]
 *      description: api for admin to upgrade driver to dispatcher
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
 *          description: Return with dispatcher object
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.put(
  '/driver-upgrade/:id',
  auth,
  superAdmin,
  AdminController.driverToDispatcher,
);
export default router;
