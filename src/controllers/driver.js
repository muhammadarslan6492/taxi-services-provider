/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
import Stripe from 'stripe';
import { Conflict } from 'fejl';

import Model from '../models';
import { acceptMail, rejectMail } from '../helpers/mailSender/dispatcher';

const stripe = new Stripe(process.env.STRIPE_KEY);
const { Booking, User, Payment, OnBoarding, Car, Brand } = Model;

export default {
  getAllRides: async (req, res) => {
    try {
      const booking = await Booking.findAll({
        where: { driverId: req.user.id },
      });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  rideAR: async (req, res) => {
    try {
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      const dispatcher = await User.findOne({
        where: { id: booking.dispatcherId },
      });
      const status = await booking.update({
        bookingStatus: req.body.bookingStatus,
      });
      if (status.bookingStatus === 'Rejected') {
        await rejectMail(dispatcher.email, { reason: req.body.reason });
        return res.status(200).json({ msg: 'Ride Rejected.' });
      }
      if (status.bookingStatus === 'Pending') {
        return res.status(200).json({ msg: 'Still Pending.', status });
      }
      await acceptMail(dispatcher.email, 'Driver accept your assign ride.');
      return res.status(200).json({ msg: 'Booking Accepted' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  startRide: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      await booking.update({
        rideStart: true,
        positions: [{ lat: req.body.lat, lng: req.body.lng }],
      });
      await user.update({
        status: 'occupied',
      });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  rideInTransit: async (req, res) => {
    try {
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      await booking.update({
        rideInTransit: true,
      });
      return res.status(200).json(booking);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  driverRideLoc: async (req, res) => {
    try {
      let tempArr = [];
      const booking = await Booking.findOne({ where: { id: req.params.id } });
      tempArr = JSON.parse(booking.positions);
      tempArr.push({ lat: req.body.lat, lng: req.body.lng });
      await booking.update({
        positions: tempArr,
      });
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  driverStatus: async (req, res) => {
    try {
      const driver = await User.findOne({ where: { id: req.user.id } });
      await User.update(
        {
          status: req.body.status,
        },
        {
          where: { id: req.user.id },
        }
      );
      return res.status(200).json(driver);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatelocation: async (req, res) => {
    try {
      const driver = await User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: [
          'id',
          'fullName',
          'displayName',
          'role',
          'phoneNumber',
          'lat',
          'lng',
          'status',
        ],
        include: [
          {
            model: OnBoarding,
            as: 'vehicle',
            where: { isCurrent: true },
            attributes: ['id', 'numberPlate'],
            include: [
              {
                model: Car,
              },
              {
                model: Brand,
              },
            ],
          },
        ],
      });
      await driver.update({
        lat: req.body.lat,
        lng: req.body.lng,
        locationTimeStamp: new Date(),
        online: true,
      });
      req.io.emit('location-changes', driver);
      return res.status(200).json({ msg: 'Driver location updated.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  upgrade: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user.role === 'Driver') {
        await stripe.customers.create({
          name: req.user.name,
          email: req.user.email,
          source: 'tok_visa',
        });
        const charges = await stripe.charges.create({
          amount: req.body.amount,
          currency: 'usd',
          // source: 'tok_visa',
          source: req.body.source,
          description: 'Thank you',
        });
        if (charges) {
          await Payment.create({
            isPaid: true,
            amount: req.body.amount,
            userId: req.user.id,
          });
        }
        const payment = await Payment.findOne({
          where: { userId: req.user.id },
        });
        if (payment.isPaid) {
          await user.update({
            role: 'Dispatcher',
          });
        }
        return res
          .status(200)
          .json({ msg: 'Driver Successfully upgraded to Dispatcher' });
      }
      return res.status(409).json({
        msg: 'you are already dispatcher or not verified as a driver',
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  rideEnd: async (req, res) => {
    try {
      const ride = await Booking.findOne({ where: { id: req.params.id } });
      const user = await User.findOne({ where: { id: req.user.id } });
      await ride.update({
        rideStatus: 'finished',
        rideEnd: true,
      });
      await user.update({
        status: 'available',
      });
      return res.status(200).json({ msg: 'Ride finished successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  driverUpgradeTest: async (req, res) => {
    try {
      const driver = await User.findOne({ where: { id: req.user.id } });
      if (driver) {
        const change = {};
        if (driver.role === 'Driver') {
          change.role = 'Dispatcher';
        }
        if (driver.role === 'Dispatcher') {
          change.role = 'Driver';
        }
        const updated = await driver.update(change);
        return res.status(200).json(updated);
      }
      throw new Conflict('Some thing went wrong');
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
