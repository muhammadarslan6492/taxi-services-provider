import cron from 'node-cron';
import Sequelize from 'sequelize';

import Models from '../models';

const { User } = Models;

const idleOffline = (io) => {
  cron.schedule('* * * * *', async () => {
    const users = await User.findAll({
      where: {
        role: {
          [Sequelize.Op.or]: ['Driver', 'Dispatcher'],
        },
        online: true,
        locationTimeStamp: {
          [Sequelize.Op.lt]: new Date(new Date() - 1000 * 60 * 5),
        },
      },
    });

    users.forEach(async (user) => {
      const { id } = user;
      await User.update({
        online: false,
      }, {
        where: {
          id,
        },
      });
      io.emit('user-removed', { id });
    });
  });
};

export default idleOffline;
