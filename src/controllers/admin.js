/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import { Conflict, BadRequest, Forbidden } from 'fejl';

import bcrypt from 'bcrypt';

import Model from '../models';
import sendEmail from '../helpers/mailSender/reject';
import signupEmail from '../helpers/mailSender/signup';
import clientRegistrationEmail from '../helpers/mailSender/client';
import Notification from '../helpers/pushNotifications';

const saltRounds = 10;
const { OnBoarding, User, Brand, Car, Booking, Client } = Model;

const generatePassword = () => {
  const length = 8;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export default {
  allOnBoarding: async (req, res) => {
    try {
      const { verify } = req.query;
      let onBroding;
      if (verify) {
        onBroding = await OnBoarding.findAll({
          where: {
            verify,
          },
          order: [['createdAt', 'DESC']],
          include: [
            'Car',
            'Brand',
            { model: User, attributes: { exclude: ['password'] } },
          ],
        });
      } else {
        onBroding = await OnBoarding.findAll({
          order: [['createdAt', 'DESC']],
          include: [
            'Car',
            'Brand',
            { model: User, attributes: { exclude: ['password'] } },
          ],
        });
      }
      return res.status(200).json(onBroding);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verify: async (req, res) => {
    try {
      const onboarding = await OnBoarding.findOne({
        where: { id: req.params.id },
      });
      const user = await User.findOne({ where: { id: onboarding.userId } });
      const onboardingChanges = {
        verify: null,
        isCurrent: false,
      };
      const userOnboardings = await OnBoarding.findAll({
        where: { userId: user.id, isCurrent: true },
      });
      if (userOnboardings.length === 0) {
        onboardingChanges.verify = 'Approved';
        onboardingChanges.isCurrent = true;
      } else {
        onboardingChanges.verify = 'Approved';
      }
      Notification.sendPushNotificationToToken(
        user.id,
        'Onboarding Verified',
        'Your submitted onboarding has been verified',
        'push-test'
      );
      await onboarding.update(onboardingChanges);
      await user.update({
        onBoardingVerified: 'Approved',
      });
      return res.status(200).json({ msg: 'Driver successfully verified.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  reject: async (req, res) => {
    try {
      const { body } = req;
      const onboarding = await OnBoarding.findOne({
        where: { id: req.params.id },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
      });
      const user = await User.findOne({ where: { id: onboarding.userId } });
      Notification.sendPushNotificationToToken(
        user.id,
        'Onboarding Rejected',
        'Your submitted onboarding has been rejected',
        'default'
      );
      await onboarding.update({
        verify: 'Rejected',
      });
      const userOnboardings = await OnBoarding.findAll({
        where: { userId: user.id },
      });
      if (userOnboardings.length === 1) {
        await user.update({
          onBoardingVerified: 'Rejected',
        });
      }
      sendEmail.rejectMAil(onboarding.User.email, body.reason);
      return res.status(200).json({ msg: 'OnBoarding Rejected.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllDispatcher: async (req, res) => {
    try {
      const dispatcher = await User.findAll({
        where: { role: 'Dispatcher' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(dispatcher);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  dispatcherByID: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.params.id, role: 'Dispatcher' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(dispatcher);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  assignlocation: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.params.id, role: 'Dispatcher' },
        attributes: { exclude: ['password'] },
      });
      await dispatcher.update({
        activeCity: req.body.activeCity,
      });
      return res.status(200).json(dispatcher);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  completeVehicleList: async (req, res) => {
    try {
      const fetchedData = await Brand.findAll({
        include: [
          {
            model: Car,
            required: false,
            order: ['carName', 'ASC'],
          },
        ],
        order: [['brandName', 'ASC']],
      });
      return res.status(200).json(fetchedData);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getCompanies: async (req, res) => {
    try {
      const company = await User.findAll({
        where: { role: 'Organization' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(company);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCompany: async (req, res) => {
    try {
      const { body } = req;
      if (body.displayName.indexOf(' ') >= 0) {
        throw new BadRequest('spaceses not allowed in DisplayName');
      }
      const exist = await User.findOne({
        where: { companyName: body.companyName },
        attributes: { exclude: ['password'] },
      });
      if (exist) {
        throw new Conflict('Company name already taken.');
      }
      const password = await bcrypt.hash(body.password, saltRounds);
      body.password = password;
      body.role = 'Organization';
      const user = await User.create(body);
      await signupEmail(user.email, user.toJSON());
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCompany: async (req, res) => {
    try {
      const company = await User.findOne({
        where: { id: req.params.id, role: 'Organization' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(company);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCompany: async (req, res) => {
    try {
      const company = await User.findOne({
        where: { id: req.params.id, role: 'Organization' },
      });
      await company.destroy();
      return res.status(204).json({ msg: 'Company deleleted successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCompany: async (req, res) => {
    try {
      const { body } = req;
      const company = await User.findOne({
        where: { id: req.params.id, role: 'Organization' },
      });
      const updated = await company.update({
        displayName: body.displayName,
        country: body.country,
        city: body.city,
        activeCity: body.activeCity,
        address: body.address,
        addressLineTwo: body.addressLineTwo,
        postalCode: body.postalCode,
        IBAN: body.IBAN,
      });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDrivers: async (req, res) => {
    try {
      const drivers = await User.findAll({
        where: { role: 'Driver' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(drivers);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDriver: async (req, res) => {
    try {
      const driver = await User.findOne({
        where: { id: req.params.id, role: 'Driver' },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(driver);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBookings: async (req, res) => {
    try {
      const { bookingStatus } = req.query;
      let booking;
      if (bookingStatus) {
        booking = await Booking.findAll({
          where: { bookingStatus },
          include: [
            {
              model: User,
              as: 'company',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'driver',
              attributes: { exclude: ['password'] },
            },
          ],
        });
      } else {
        booking = await Booking.findAll({
          include: [
            {
              model: User,
              as: 'company',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'driver',
              attributes: { exclude: ['password'] },
            },
          ],
        });
      }
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: User,
            as: 'company',
            attributes: { exclude: ['password'] },
          },
          {
            model: User,
            as: 'dispatcher',
            attributes: { exclude: ['password'] },
          },
          {
            model: User,
            as: 'driver',
            attributes: { exclude: ['password'] },
          },
        ],
      });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDispatcher: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.params.id, role: 'Dispather' },
      });
      await dispatcher.destroy();
      return res.status(204).json({ msg: 'Dispatcher deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  block: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.params.id, role: 'Dispatcher' },
      });
      await dispatcher.update({
        block: true,
      });
      return res.status(200).json({ msg: 'Dispatcher blocked' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unBlock: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.params.id, role: 'Dispatcher' },
        attributes: { exclude: ['password'] },
      });
      await dispatcher.update({
        block: false,
      });
      return res
        .status(200)
        .json({ msg: 'dispatcher un-blocked sucessfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateDriver: async (req, res) => {
    try {
      const driver = await User.findOne({ where: { id: req.params.id } });
      await driver.update({
        activeCity: req.body.activeCity,
        userId: req.body.userId,
      });
      return res.status(200).json({ msg: 'Driver updated successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDriver: async (req, res) => {
    try {
      const driver = await User.findOne({
        where: { id: req.params.id, role: 'Driver' },
      });
      await driver.destroy({ where: { id: req.params.id } });
      return res.status(204).json({ msg: 'Driver deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  blockDriver: async (req, res) => {
    try {
      const driver = await User.findOne({
        where: { id: req.params.id, role: 'Driver' },
        attributes: { exclude: ['password'] },
      });
      await driver.update({
        block: true,
      });
      return res.status(200).json({ msg: 'Driver blocked sucessfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unBlockDriver: async (req, res) => {
    try {
      const driver = await User.findOne({
        where: { id: req.params.id, role: 'Driver' },
        attributes: { exclude: ['password'] },
      });
      await driver.update({
        block: false,
      });
      return res.status(200).json({ msg: 'Driver unblocked sucessfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getCompanyDomain: async (req, res) => {
    try {
      const company = await User.findOne({ where: { id: req.params.id } });
      return res.status(200).json({ domain: company.domain });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  driverToDispatcher: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.params.id } });
      if (user.role === 'Driver') {
        const updated = await user.update({
          role: 'Dispatcher',
        });
        return res.status(200).json(updated);
      }
      if (user.role === 'Dispatcher') {
        const updated = await user.update({
          role: 'Driver',
        });
        return res.status(200).json(updated);
      }
      throw new Conflict('Driver or Dispatcher not found');
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createClient: async (req, res) => {
    try {
      if (req.user.role !== 'Organization') {
        throw new Forbidden('You are not authorized to create client');
      }
      const { email, firstName, lastName } = req.body;
      const clientSearch = await Client.findOne({
        where: { email, userId: req.user.id },
      });
      if (clientSearch) {
        throw new Conflict('Client already exists');
      }
      const password = generatePassword();
      const encryptedPassword = await bcrypt.hash(password, 10);
      const client = await Client.create({
        email,
        firstName,
        lastName,
        password: encryptedPassword,
        userId: req.user.id,
      });
      await clientRegistrationEmail(firstName, lastName, email, password);
      return res.status(201).json(client);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: error.message, statusCode: error.statusCode });
    }
  },
};
