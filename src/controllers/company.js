/* eslint-disable comma-dangle */
import { BadRequest } from 'fejl';
import Notification from '../helpers/pushNotifications';
import Model from '../models';

const { Booking, User } = Model;

export default {
  createRide: async (req, res) => {
    try {
      const genId = `Mobio-21-${Math.floor(
        10000000 + Math.random() * 90000000 + 1
      )}`;
      let givenDate = req.body.dateTime;
      const currentDate = new Date();
      givenDate = new Date(givenDate);
      if (givenDate < currentDate) {
        throw new BadRequest(
          'Past dates are not supported for booking creation.'
        );
      }
      const {
        pickup,
        noOfPeople,
        carType,
        fare,
        destination,
        notes,
        guestName,
        guestPhoneNumber,
        flightNumber,
        nameCaller,
        paymentType,
        clientId,
      } = req.body;
      const bookingObject = {
        pickup,
        dateTime: givenDate,
        noOfPeople,
        carType,
        fare,
        userId: req.user.id,
        destination,
        notes,
        guestName,
        guestPhoneNumber,
        flightNumber,
        nameCaller,
        refId: genId,
        bookingStatus: 'Pending',
        paymentType,
        clientId,
      };
      if (req.body.dispatcherId) {
        bookingObject.dispatcherId = req.body.dispatcherId;
      }
      const booking = await Booking.create(bookingObject);
      Notification.sendPushNotificationToToken(
        req.body.dispatcherId,
        'Booking Update',
        'You have been assigned a new booking.'
      );
      return res.status(201).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  allBooking: async (req, res) => {
    try {
      const booking = await Booking.findAll();
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  bookingById: async (req, res) => {
    try {
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateBooking: async (req, res) => {
    try {
      let givenDate = req.body.dateTime;
      const currentDate = new Date();
      givenDate = new Date(givenDate);
      if (givenDate < currentDate) {
        throw new BadRequest('Past dates are not supported.');
      }
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      const {
        pickup,
        noOfPeople,
        carType,
        fare,
        destination,
        notes,
        guestPhoneNumber,
        flightNumber,
        nameCaller,
      } = req.body;
      const bookingObject = {
        pickup,
        dateTime: givenDate,
        noOfPeople,
        carType,
        fare,
        userId: req.user.id,
        destination,
        notes,
        guestPhoneNumber,
        flightNumber,
        nameCaller,
        bookingStatus: 'Pending',
      };
      if (req.body.dispatcherId) {
        bookingObject.dispatcherId = req.body.dispatcherId;
      }
      await booking.update(bookingObject);
      Notification.sendPushNotificationToToken(
        req.body.dispatcherId,
        'Booking Update',
        'You have been assigned a new booking.'
      );
      return res.status(200).json({ msg: 'Booking successfully updated.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteBooking: async (req, res) => {
    try {
      await Booking.distroy({ where: { id: req.params.id } });
      return res.status(200).json({ msg: 'Booking deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDomain: async (req, res) => {
    try {
      const company = await User.findOne({ where: { id: req.user.id } });
      return res.status(200).json({ domain: company.domain });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDispatchers: async (req, res) => {
    try {
      const dispatchers = await User.findAll({
        where: { role: 'Dispatcher' },
        attributes: ['id', 'fullName', 'displayName'],
      });
      return res.status(200).json(dispatchers);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
