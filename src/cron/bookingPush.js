import moment from 'moment';
import cron from 'node-cron';
import Sequelize from 'sequelize';
import Notification from '../helpers/pushNotifications';
import Models from '../models';

const { Booking } = Models;

const sendPush = () => {
  cron.schedule('* * * * *', async () => {
    const bookings = await Booking.findAll({
      where: {
        dateTime: {
          [Sequelize.Op.gte]: new Date(),
          [Sequelize.Op.lte]: new Date(new Date() + 1000 * 60 * 61),
        },
        driverId: {
          [Sequelize.Op.ne]: null,
        },
        dispatcherId: {
          [Sequelize.Op.ne]: null,
        },
      },
      attributes: ['id', 'dateTime', 'driverId', 'dispatcherId'],
    });
    bookings.forEach(async (booking) => {
      const date = moment();
      const bookingDate = moment(booking.dateTime);
      const diff = bookingDate.diff(date, 'minutes');
      if (diff === 60) {
        Notification.sendPushNotificationToToken(booking.driverId, 'Reminder', 'Your ride is about to start in an hour', 'test-push');
      }
      if (diff === 30) {
        await Notification.sendPushNotificationToToken(booking.driverId, 'Reminder', 'Your ride is about to start in 30 minutes', 'test-push');
      }
      if (diff === 15) {
        await Notification.sendPushNotificationToToken(booking.driverId, 'Reminder', 'Your ride is about to start in 15 minutes', 'test-push');
      }
      if (diff === 5) {
        await Notification.sendPushNotificationToToken(booking.driverId, 'Reminder', 'Your ride is about to start in 5 minutes', 'test-push');
      }
      if (diff === 1) {
        await Notification.sendPushNotificationToToken(booking.driverId, 'Reminder', 'Your ride is about to start in 1 minute', 'test-push');
      }
    });
  });
};

export default sendPush;
