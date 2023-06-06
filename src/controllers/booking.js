/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Conflict } from 'fejl';
import _ from 'lodash';
import moment from 'moment';
import sequelize from 'sequelize';

import Model from '../models';

const { Booking, User, Client } = Model;

const op = sequelize.Op;

export default {
  planingRides: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      let booking;
      if (user.role === 'Driver') {
        booking = await Booking.findAll({
          where: {
            driverId: user.id,
            rideEnd: false,
            rideStart: false,
            dateTime: {
              [op.gte]: new Date(),
            },
          },
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'fullName', 'displayName', 'phoneNumber'],
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: ['id', 'fullName', 'displayName'],
            },
          ],
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Dispatcher') {
        booking = await Booking.findAll({
          where: {
            dispatcherId: {
              [op.or]: [user.id, null],
            },
            rideEnd: false,
            rideStart: false,
            driverId: null,
            dateTime: {
              [op.gte]: new Date(),
            },
          },
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Organization') {
        booking = await Booking.findAll({
          where: {
            userId: user.id,
            rideEnd: false,
            rideStart: false,
            dispatcherId: null,
            driverId: null,
            dateTime: {
              [op.gte]: new Date(),
            },
          },
          include: [
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Admin') {
        booking = await Booking.findAll({
          where: {
            rideEnd: false,
            dispatcherId: null,
            driverId: null,
            dateTime: {
              [op.gte]: new Date(),
            },
          },
          order: [['dateTime', 'ASC']],
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });
      }
      booking.map((item) => {
        item.pickup = JSON.parse(item.pickup);
        item.destination = JSON.parse(item.destination);
        item.positions = JSON.parse(item.positions);
        return item;
      });
      const data = _.chain(booking)
        .groupBy((record) => moment(record.dateTime).format('YYYY-MM-DD'))
        .map((value, key) => ({
          date: key,
          data: value,
        }))
        .value();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  historyRide: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      let booking;
      if (user.role === 'Driver') {
        booking = await Booking.findAll({
          where: {
            [op.or]: [
              {
                driverId: user.id,
                rideEnd: true,
              },
              {
                driverId: user.id,
                dateTime: {
                  [op.lt]: new Date(),
                },
              },
            ],
          },
          order: [['dateTime', 'ASC']],
          include: [
            {
              model: User,
              as: 'dispatcher',
              attributes: ['id', 'fullName', 'displayName'],
            },
          ],
        });
      }
      if (user.role === 'Dispatcher') {
        booking = await Booking.findAll({
          where: {
            [op.or]: [
              {
                dispatcherId: user.id,
                rideEnd: true,
              },
              {
                dispatcherId: user.id,
                dateTime: {
                  [op.lt]: new Date(),
                },
              },
            ],
          },
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Organization') {
        booking = await Booking.findAll({
          where: {
            [op.or]: [
              {
                userId: user.id,
                rideEnd: true,
              },
              {
                userId: user.id,
                dateTime: {
                  [op.lt]: new Date(),
                },
              },
            ],
          },
          include: [
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Admin') {
        booking = await Booking.findAll({
          where: {
            [op.or]: [
              {
                rideEnd: true,
              },
              {
                dateTime: {
                  [op.lt]: new Date(),
                },
              },
            ],
          },
          include: [
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'displayName'],
            },
          ],
          order: [['dateTime', 'ASC']],
        });
      }
      booking.map((item) => {
        item.pickup = JSON.parse(item.pickup);
        item.destination = JSON.parse(item.destination);
        item.positions = JSON.parse(item.positions);
        return item;
      });
      const data = _.chain(booking)
        .groupBy((record) => moment(record.dateTime).format('YYYY-MM-DD'))
        .map((value, key) => ({
          date: key,
          data: value,
        }))
        .value();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  assigned: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      let booking;
      if (user.role === 'Driver') {
        booking = await Booking.findAll({
          // where: { driverId: user.id, rideEnd: false },
          where: {
            driverId: user.id,
            rideEnd: false,
            dateTime: {
              [op.gte]: new Date(),
            },
          },
          order: [['dateTime', 'ASC']],
          include: [
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'fullName', 'displayName', 'phoneNumber'],
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: ['id', 'fullName', 'displayName'],
            },
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
          ],
        });
      }
      if (user.role === 'Dispatcher') {
        booking = await Booking.findAll({
          where: {
            dispatcherId: user.id,
            driverId: { [op.ne]: null },
            dateTime: {
              [op.gt]: new Date(),
            },
            rideEnd: false,
          },
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'fullName', 'displayName', 'phoneNumber'],
            },
          ],
          order: [['dateTime', 'ASC']],
        });
      }
      if (user.role === 'Organization') {
        booking = await Booking.findAll({
          where: {
            userId: user.id,
            dateTime: {
              [op.gt]: new Date(),
            },
            dispatcherId: {
              [op.ne]: null,
            },
            rideEnd: false,
          },
          order: [['dateTime', 'ASC']],
          include: [
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'fullName', 'displayName', 'phoneNumber'],
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: ['id', 'fullName', 'displayName'],
            },
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });
      }
      if (user.role === 'Admin') {
        booking = await Booking.findAll({
          where: {
            userId: user.id,
            dateTime: {
              [op.gt]: new Date(),
            },
            dispatcherId: {
              [op.ne]: null,
            },
            rideEnd: false,
          },
          order: [['dateTime', 'ASC']],
          include: [
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'fullName', 'displayName', 'phoneNumber'],
            },
            {
              model: User,
              as: 'dispatcher',
              attributes: ['id', 'fullName', 'displayName'],
            },
            {
              model: User,
              as: 'company',
              attributes: ['id', 'fullName', 'companyName'],
            },
            {
              model: Client,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });
      }
      booking.map((item) => {
        item.pickup = JSON.parse(item.pickup);
        item.destination = JSON.parse(item.destination);
        item.positions = JSON.parse(item.positions);
        return item;
      });
      const data = _.chain(booking)
        .groupBy((record) => moment(record.dateTime).format('YYYY-MM-DD'))
        .map((value, key) => ({
          date: key,
          data: value,
        }))
        .value();

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  abortBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({
        where: { id, cancelled: false },
      });
      if (booking) {
        await booking.update({
          rideEnd: true,
          cancelled: true,
          cancellationReason: req.body,
        });
        await User.update(
          {
            status: 'available',
          },
          {
            where: {
              id: booking.driverId,
            },
          }
        );
        return res.status(200).json({ msg: 'Booking cancelled' });
      }
      throw new Conflict('No booking found');
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
