/* eslint-disable comma-dangle */
import axios from 'axios';
import Models from '../models';

const { User } = Models;

const sendPushNotificationToToken = async (
  id,
  title = 'Mobio App',
  message,
  channelId = 'default'
) => {
  const user = await User.findOne({
    where: {
      id,
    },
    attributes: ['pushToken'],
  });
  return new Promise((resolve, reject) => {
    if (user.pushToken) {
      const { pushToken } = user;
      const payload = {
        to: pushToken,
        data: { extraData: 'Some data' },
        title,
        body: message,
        channelId,
      };
      axios
        .post('https://exp.host/--/api/v2/push/send', payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('User has no push token'));
    }
  });
};

const sendChatNotification = async (senderId, receiverId, message) => {
  const sender = await User.findOne({
    where: {
      id: senderId,
    },
    attributes: ['fullName'],
  });
  const title = `${sender.fullName}`;
  const channelId = 'default';
  const messageBody = `${message}`;
  const response = sendPushNotificationToToken(
    receiverId,
    title,
    messageBody,
    channelId
  );
  return response;
};

export default {
  sendPushNotificationToToken,
  sendChatNotification,
};
