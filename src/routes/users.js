import express from 'express';
import UserController from '../controllers/user';
import DriverController from '../controllers/driver';
import Validators from '../middlewares/validators';
import auth from '../middlewares/auth';
// import blacklistMiddleware from '../middlewares/checkBlacklist';
import upload from '../helpers/upload';
import { driverDispatcher } from '../middlewares/roles';

const { Router } = express;

const router = Router();
/**
 * @openapi
 * /user/mobile/signup:
 *  post:
 *      tags: [Users]
 *      description: Signup Api for mobile apps
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          description: required fields for mobile signup
 *          schema:
 *            type: object
 *            required:
 *              - displayName
 *              - fullName
 *              - email
 *              - address
 *              - postalCode
 *              - city
 *              - phoneNumber
 *              - password
 *              - activeCity
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
 *              password:
 *                type: string
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
  '/mobile/signup',
  Validators.MobileSinupMiddleware,
  UserController.signupMobile,
);
/**
 * @openapi
 * /user/mobile/login:
 *    post:
 *      tags:
 *        - Users
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      description: Login api for mobile apps
 *      parameters:
 *        - in: body
 *          name: credentials
 *          description: Required fields for login api from mobile apps
 *          schema:
 *            type: object
 *            required:
 *              - displayName
 *              - password
 *              - activeCity
 *            properties:
 *              displayName:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: A JSON object of LogedIn User
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
 *              password:
 *                type: string
 *              token:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *        400:
 *          description: Invalid request
 *        409:
 *          description: Invalid username or password
 *        500:
 *          description: Server error
 */
router.post(
  '/mobile/login',
  Validators.MobileLoginMiddleware,
  UserController.loginMobile,
);
/**
 * @openapi
 * /user/change-password:
 *  put:
 *   tags: [Users]
 *   description: Change password api
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      description: required fields for change password
 *      schema:
 *       type: object
 *       required:
 *        - oldPassword
 *        - newPassword
 *       properties:
 *         oldPassword:
 *          type: string
 *         newPassword:
 *          type: string
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put(
  '/change-password',
  auth,
  UserController.changePassword,
);
/**
 * @openapi
 * /user/update-profile:
 *  put:
 *   tags: [Users]
 *   description: Update profile api
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      schema:
 *       type: object
 *       properties:
 *        displayName:
 *         type: string
 *        address:
 *         type: string
 *        addressLineTwo:
 *         type: string
 *        postalCode:
 *         type: string
 *        city:
 *         type: string
 *        phoneNumber:
 *         type: string
 *        activeCity:
 *         type: string
 *        country:
 *         type: string
 *        activeCountry:
 *         type: string
 *    - in: header
 *      name: Authorization
 *      description: Bearer token
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put(
  '/update-profile',
  auth,
  UserController.updateProfile,
);
router.get('/verify/:JWT', UserController.verify);
router.get('/resend/:JWT', UserController.resend);
/**
 * @openapi
 * /user/web/signup:
 *  post:
 *      tags: [Users]
 *      description: Signup Api for web app
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          description: required fields for web signup
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
 *              email:
 *                type: string
 *              IBAN:
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
 *
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
  '/web/signup',
  Validators.WebSignupMiddleware,
  UserController.webSignup,
);
/**
 * @openapi
 * /user/web/login:
 *    post:
 *      tags:
 *        - Users
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      description: Login api for web apps
 *      parameters:
 *        - in: body
 *          name: credentials
 *          description: Required fields for login api from web apps
 *          schema:
 *            type: object
 *            required:
 *              - displayName
 *              - password
 *              - activeCity
 *            properties:
 *              displayName:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: A JSON object of LogedIn User
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
 *              password:
 *                type: string
 *              token:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *        400:
 *          description: Invalid request
 *        409:
 *          description: Invalid username or password
 *        500:
 *          description: Server error
 */
router.post(
  '/web/login',
  Validators.WebLoginMiddleware,
  UserController.webLogin,
);
/**
 * @openapi
 * /user/upload:
 *    post:
 *      description: Upload document
 *      tags:
 *        - Users
 *      consumes:
 *        multipart/form-data
 *      produces:
 *        application/json
 *      parameters:
 *        - in: formData
 *          name: image
 *          description: image file object
 *          type: file
 *        - in: header
 *          name: Authorization
 *          type: apiKey
 *          description: Bearer token
 *      responses:
 *         200:
 *            description: Image uploaded. Returns a url.
 *         400:
 *            description: Invalid request type.
 *         403:
 *            description: Header issues
 *         500:
 *            description: Server side Error
 */
router.post(
  '/upload',
  (req, res, next) => {
    next();
  },
  auth,
  upload.single('image'),
  UserController.upload,
);
/**
 * @openapi
 * /user/profile:
 *  get:
 *      tags: [Users]
 *      description: get user profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: Header
 *          name: Authorization
 *      responses:
 *        200:
 *          description: A JSON object of user
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
router.get('/profile', auth, UserController.profile);
/**
 * @openapi
 * /user/onboarding:
 *    post:
 *      description: Create onboarding
 *      consumes:
 *        application/json
 *      produces:
 *        application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - in: body
 *          name: onboarding
 *          type: object
 *          description: Fields for onboarding api
 *          schema:
 *            required:
 *              - numberPlate
 *              - insuranceDocument
 *              - vehicleCard
 *              - pictures
 *              - carId
 *              - brandId
 *            properties:
 *              carId:
 *                  type: string
 *              brandId:
 *                  type: string
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
 *        - in: header
 *          name: Authorization
 *          description: Bearer Token
 *          type: apiKey
 *      responses:
 *        201:
 *          description: Retune verify status of onboarding
 *          content:
 *            application/json
 *          schema:
 *            type: object
 *            properties:
 *              verify:
 *                  type: string
 *        400:
 *          description: bad request
 *        500:
 *          description: Server error
 *        403:
 *          description: Token issue
 */
router.post(
  '/onboarding',
  auth,
  driverDispatcher,
  Validators.OnboardingMiddleware,
  UserController.addOnboarding,
);
/**
 * @openapi
 * /user/onboarding:
 *  get:
 *      tags: [Users]
 *      description: get onboarding
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: Bearer Token
 *          type: apiKey
 *      responses:
 *        200:
 *          description: A JSON object containing onboarding info
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
router.get('/onboarding', auth, UserController.getOnBoarding);
/**
 * @openapi
 * /user/onboarding/update/{id}:
 *    put:
 *      description: Update OnBoarding
 *      consumes:
 *        application/json
 *      produces:
 *        application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: body
 *          name: onboarding
 *          type: object
 *          description: Fields for onboarding api
 *          schema:
 *            required:
 *              - carId
 *              - brandId
 *              - numberPlate
 *              - insuranceDocument
 *              - licenseCard
 *              - vehicleCard
 *              - pictures
 *            properties:
 *              carId:
 *                  type: string
 *              brandId:
 *                  type: string
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
 *        - in: header
 *          name: Authorization
 *          description: Bearer Token
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
 *        400:
 *          description: bad request
 *        409:
 *          description: conflict
 *        500:
 *          description: Server errorS
 *        403:
 *          description: Token issue
 */
router.put(
  '/onboarding/update/:id',
  auth,
  driverDispatcher,
  Validators.OnboardingMiddleware,
  UserController.updateOnboarding,
);
/**
 * @openapi
 * /user/logout:
 *  get:
 *      tags: [Users]
 *      description: api for logout
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
router.get('/logout', auth, UserController.logout);
/**
 * @openapi
 * /user/company/details/{domain}:
 *  get:
 *      tags: [Users]
 *      description: getting onBoarding verifying by id api
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: domain
 *      responses:
 *        200:
 *          description: Return the object of company details
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.get('/company/details/:domain', UserController.companyDetail);
/**
 * @openapi
 * /user/password-forgot:
 *  post:
 *      tags: [Users]
 *      description: User forgot password
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          properties:
 *            email:
 *              type: string
 *      responses:
 *        200:
 *          description: Return with notification message
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.post('/password-forgot', UserController.forgotPassword);
/**
 * @openapi
 * /user/password-reset/{token}:
 *  post:
 *      tags: [Users]
 *      description: User password reset
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: token
 *        - in: body
 *          name: user
 *          properties:
 *            password:
 *              type: string
 *      responses:
 *        200:
 *          description: Return the with success message
 *        500:
 *          description: Server Error
 *        400:
 *          description: Invalid request
 */
router.post('/password-reset/:token', UserController.resetPassword);

/**
 * @openapi
 * /user/onboardings:
 * get:
 *    tags: [Users]
 *    description: Get all onboardings of user
 *    produces:
 *     - application/json
 *    parameters:
 *     - in: header
 *       name: Authorization
 *       description: Bearer Token
 *       type: apiKey
 *    responses:
 *     200:
 *       description: Return with success message
 *       content:
 *         application/json
 *     400:
 *       description: Invalid request
 *     401:
 *       description: Unauthorized
 *     403:
 *       description: Forbidden
 *     500:
 *       description: Server Error
 */
router.get('/onboardings', auth, driverDispatcher, UserController.getOnBoardings);
/**
 * @openapi
 * /user/locations:
 *  get:
 *   tags: [Users]
 *   description: Get all locations of user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: Authorization
 *      description: Bearer Token
 *      type: apiKey
 *   responses:
 *     200:
 *      description: Return with success message
 *     400:
 *      description: Invalid request
 *     401:
 *      description: Unauthorized
 *     403:
 *      description: Forbidden
 *     500:
 *      description: Server Error
 */
router.get('/locations', auth, UserController.getLocations);

/**
 * @openapi
 * /user/onboarding/current/{id}:
 *  put:
 *   tags: [Users]
 *   description: Change current onboarding of user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *    - in: header
 *      name: Authorization
 *      description: Bearer Token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with success message
 *    400:
 *     description: Invalid request
 *    401:
 *     description: Unauthorized
 *    403:
 *     description: Forbidden
 *    409:
 *     description: Conflict
 *    500:
 *     description: Server Error
 */
router.put('/onboarding/current/:id', auth, UserController.selectCurrentOnboarding);
/**
 * @openapi
 * /user/location:
 *  put:
 *   tags: [Users]
 *   description: Change location of user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: location
 *      description: Location
 *      schema:
 *        type: object
 *        properties:
 *          lat:
 *            type: number
 *          lng:
 *            type: number
 *    - in: header
 *      name: Authorization
 *      description: Bearer Token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with success message
 *    400:
 *     description: Invalid request
 *    401:
 *     description: Unauthorized
 *    403:
 *     description: Forbidden
 *    500:
 *     description: Server Error
 */
router.put('/location', auth, driverDispatcher, DriverController.updatelocation);
/**
 * @openapi
 * /user/token:
 *  put:
 *   tags: [Users]
 *   description: Update token of user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: token
 *      description: Token
 *      schema:
 *       type: object
 *       properties:
 *        pushToken:
 *          type: string
 *    - in: header
 *      name: Authorization
 *      description: Bearer Token
 *      type: apiKey
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.put('/token', auth, UserController.updatePushToken);
/**
 * @openapi
 * /user/notify/{id}:
 *  get:
 *   tags: [Users]
 *   description: Send Notification to user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      description: User id
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.get('/notify/:id', UserController.testNotification);
/**
 * @openapi
 * /user/check/display-name:
 *  post:
 *   tags: [Users]
 *   description: Check display name of user
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: displayName
 *      description: Display name
 *      schema:
 *       type: object
 *       properties:
 *        displayName:
 *          type: string
 *   responses:
 *    200:
 *     description: Return with success message
 *    500:
 *     description: Server Error
 */
router.post('/check/display-name', UserController.checkDisplayName);

export default router;
