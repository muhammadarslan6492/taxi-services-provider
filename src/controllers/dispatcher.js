/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
import { Conflict, Forbidden } from 'fejl';
import sequelize from 'sequelize';
import Notification from '../helpers/pushNotifications';
import Model from '../models';

import { DispatcherEmail } from '../helpers/mailSender/dispatcher';

const { Booking, User, OnBoarding, Car, Brand } = Model;
const op = sequelize.Op;

export default {
  getDriverInLoc: async (req, res) => {
    try {
      const dispatcher = await User.findOne({ where: { id: req.user.id } });
      const driver = await User.findAll({
        where: {
          activeCity: dispatcher.activeCity,
          role: 'Driver',
          onBoardingVerified: 'Approved',
        },
        include: [
          {
            model: OnBoarding,
            as: 'vehicle',
            attributes: ['numberPlate'],
            include: [
              {
                model: Car,
                attributes: ['carName', 'category'],
              },
              {
                model: Brand,
                attributes: ['brandName'],
              },
            ],
          },
        ],
        attributes: ['fullName', 'displayName', 'phoneNumber', 'id'],
      });
      if (!driver) {
        throw new Conflict('Driver not found in your network.');
      }
      return res.status(200).json(driver);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllBooking: async (req, res) => {
    try {
      const dispatcher = await User.findOne({
        where: { id: req.user.id },
      });
      const booking = await Booking.findAll({
        where: { dispatcherId: dispatcher.id },
      });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  assignRide: async (req, res) => {
    try {
      const driver = await User.findOne({ where: { id: req.params.id } });
      const booking = await Booking.findOne({
        where: {
          id: req.body.bookingId,
          dispatcherId: {
            [op.or]: [req.user.id, null],
          },
        },
      });
      if (booking) {
        if (req.user.role === 'Dispatcher') {
          await booking.update({
            driverId: driver.id,
            bookingStatus: 'Pending',
            dispatcherId: req.user.id,
          });
        } else {
          await booking.update({
            driverId: driver.id,
            bookingStatus: 'Pending',
          });
        }
        await DispatcherEmail(driver.email);
        Notification.sendPushNotificationToToken(
          req.params.id,
          'Booking Update',
          'You have been assigned a new booking.'
        );
        return res.status(200).json({ msg: 'Ride assign successfully.' });
      }
      throw new Forbidden('You are not allowed to assign this ride.');
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
