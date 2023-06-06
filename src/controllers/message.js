/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import Notification from '../helpers/pushNotifications';
import Model from '../models';

const { Message, Thread, User } = Model;

export default {
  create: async (req, res) => {
    try {
      const { message, threadId } = req.body;
      const newMessage = await Message.create({
        message,
        threadId,
        senderId: req.user.id,
      });
      const thread = await Thread.findOne({
        where: {
          id: threadId,
        },
      });
      await thread.update({
        lastMessage: message,
      });
      Notification.sendChatNotification(
        req.user.id,
        req.user.id === thread.receiverId ? thread.senderId : thread.receiverId,
        message
      );
      const receiver =
        req.user.id === thread.receiverId ? thread.senderId : thread.receiverId;
      if (req.connectedUsers[receiver]) {
        const foundMessage = await Message.findOne({
          where: {
            id: newMessage.id,
          },
          include: [
            {
              model: User,
              attributes: ['displayName', 'fullName'],
            },
          ],
        });
        req.io.to(req.connectedUsers[receiver]).emit('newMessage', {
          message: foundMessage,
          threadId: thread.id,
        });
      }
      return res.status(201).json({
        message: newMessage,
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await Message.findAll({
        where: {
          threadId: id,
        },
        include: [
          {
            model: User,
            attributes: ['displayName', 'fullName'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return res.status(200).json({
        messages,
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
};
