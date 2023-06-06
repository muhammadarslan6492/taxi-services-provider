/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { Conflict, BadRequest } from 'fejl';
import { Op } from 'sequelize';
import moment from 'moment';
import _ from 'lodash';

// Models
import Model from '../models';

const { Client, User, Booking, CustomerDispatchers } = Model;

config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let client = await Client.findOne({
      where: {
        email,
      },
    });
    if (client) {
      const isMatch = await bcrypt.compare(password, client.password);
      if (isMatch) {
        await client.update({
          lastLogin: new Date(),
        });
        client.lastLogin = new Date();
        client = client.toJSON();
        delete client.password;
        client.role = 'Customer';
        const token = jwt.sign(client, process.env.JWT);

        return res.status(200).json({
          user: client,
          token,
        });
      }
      throw new Conflict('Invalid email or password');
    }
    throw new Conflict('Invalid email or password');
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const client = await Client.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (client) {
      const isMatch = await bcrypt.compare(password, client.password);
      if (isMatch) {
        const hash = await bcrypt.hash(newPassword, 10);
        await client.update({
          password: hash,
          fistLogin: false,
        });
        const token = jwt.sign(client, process.env.JWT);
        return res.status(200).json({
          user: client,
          token,
        });
      }
      throw new Conflict('Invalid email or password');
    }
    throw new Conflict('Invalid email or password');
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    let clients = await Client.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'lastLogin'],
      include: [
        {
          model: CustomerDispatchers,
          include: [
            {
              model: User,
              attributes: ['id', 'displayName', 'fullName'],
            },
          ],
        },
      ],
    });
    clients = JSON.parse(JSON.stringify(clients));
    clients = clients.map((client) => {
      client.dispatchers = client.customer_dispatchers.map(
        (dispatcher) => dispatcher.User
      );
      delete client.customer_dispatchers;
      return client;
    });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const profile = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'lastLogin'],
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
        },
      ],
    });
    if (client) {
      return res.status(200).json(client);
    }
    throw new Conflict('Client not found');
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const setProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const client = await Client.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (client) {
      await client.update({
        firstName,
        lastName,
      });
      return res.status(200).json({
        client,
      });
    }
    throw new Conflict('Client not found');
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        clientId: req.user.id,
        dateTime: {
          [Op.lt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'driver',
        },
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'dispatcher',
        },
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'company',
        },
        {
          model: Client,
          attribute: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    bookings.map((item) => {
      item.pickup = JSON.parse(item.pickup);
      item.destination = JSON.parse(item.destination);
      item.positions = JSON.parse(item.positions);
      return item;
    });
    const data = _.chain(bookings)
      .groupBy((record) => moment(record.dateTime).format('YYYY-MM-DD'))
      .map((value, key) => ({
        date: key,
        data: value,
      }))
      .value();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};
const getPlanning = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        clientId: req.user.id,
        dateTime: {
          [Op.gte]: new Date(),
        },
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'driver',
        },
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'dispatcher',
        },
        {
          model: User,
          attributes: ['id', 'displayName', 'fullName'],
          as: 'company',
        },
        {
          model: Client,
          attribute: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    bookings.map((item) => {
      item.pickup = JSON.parse(item.pickup);
      item.destination = JSON.parse(item.destination);
      item.positions = JSON.parse(item.positions);
      return item;
    });
    const data = _.chain(bookings)
      .groupBy((record) => moment(record.dateTime).format('YYYY-MM-DD'))
      .map((value, key) => ({
        date: key,
        data: value,
      }))
      .value();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const createBooking = async (req, res) => {
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
      paymentType,
      nameCaller,
    } = req.body;
    const bookingObject = {
      pickup,
      dateTime: givenDate,
      noOfPeople,
      carType,
      fare,
      userId: req.user.userId,
      destination,
      notes,
      guestName,
      guestPhoneNumber,
      flightNumber,
      nameCaller,
      refId: genId,
      bookingStatus: 'Pending',
      paymentType,
      clientId: req.user.id,
    };
    const booking = await Booking.create(bookingObject);
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    let givenDate = req.body.dateTime;
    const currentDate = new Date();
    givenDate = new Date(givenDate);
    if (givenDate < currentDate) {
      throw new BadRequest(
        'Past dates are not supported for booking creation.'
      );
    }
    const { bookingId } = req.params;
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
      paymentType,
      nameCaller,
    } = req.body;
    const bookingObject = {
      pickup,
      dateTime: givenDate,
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
    };
    const booking = await Booking.update(bookingObject, {
      where: {
        id: bookingId,
      },
    });
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      statusCode: error.statusCode,
    });
  }
};

const addDispatcher = async (req, res) => {
  try {
    const { customerId, dispatcherIds } = req.body;
    const client = await Client.findOne({
      where: {
        id: customerId,
      },
    });
    const dispatcher = await User.findAll({
      where: {
        id: {
          [Op.in]: dispatcherIds,
        },
        role: 'Dispatcher',
      },
    });
    if (client && dispatcher) {
      await CustomerDispatchers.destroy({
        where: {
          clientId: customerId,
        },
      });
      const customerDispatchers = dispatcher.map((item) => ({
        clientId: customerId,
        UserId: item.id,
      }));

      await CustomerDispatchers.bulkCreate(customerDispatchers);

      return res.status(200).json({
        msg: 'Dispatchers added successfully',
      });
    }
    throw new Conflict('Client or Dispatcher not found');
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      statusCode: err.statusCode,
    });
  }
};

const getDispatchers = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await CustomerDispatchers.findAll({
      where: {
        clientId: id,
      },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
      ],
    });
    const response = client.map((item) => item.User);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      statusCode: err.statusCode,
    });
  }
};

export default {
  login,
  changePassword,
  getCustomers,
  profile,
  setProfile,
  getBookings,
  createBooking,
  getPlanning,
  addDispatcher,
  getDispatchers,
  updateBooking,
};
