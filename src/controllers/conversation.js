import Sequelize from 'sequelize';
import Model from '../models';
import Notification from '../helpers/pushNotifications';

const { Thread, Message, User } = Model;

export default {
  create: async (req, res) => {
    try {
      const { message, receiverId } = req.body;
      const thread = await Thread.findOne({
        where: {
          senderId: req.user.id,
          receiverId,
        },
      });
      if (thread) {
        const newMessage = await Message.create({
          message,
          threadId: thread.id,
          senderId: req.user.id,
        });
        await thread.update({
          lastMessage: message,
        });
        const messageFound = await Message.findOne({
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
        Notification.sendChatNotification(req.user.id, receiverId, message);
        if (req.connectedUsers[receiverId]) {
          req.io.to(req.connectedUsers[receiverId]).emit('newMessage', {
            message: messageFound,
            threadId: thread.id,
          });
        }
        return res.status(201).json({
          thread,
          message: newMessage,
        });
      }
      if (req.user.role === 'Dispatcher') {
        const newThread = await Thread.create({
          senderId: req.user.id,
          receiverId,
          lastMessage: message,
        });
        const newMessage = await Message.create({
          threadId: newThread.id,
          message,
          senderId: req.user.id,
        });
        Notification.sendChatNotification(req.user.id, receiverId, message);
        if (req.connectedUsers[receiverId]) {
          req.io
            .to(req.connectedUsers[receiverId])
            .emit('newthread', newThread);
        }
        return res.status(201).json({
          thread: newThread,
          message: newMessage,
        });
      }
      return res.status(400).json({
        message: 'You are not authorized to create a thread',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const threads = await Thread.findAll({
        where: {
          [Sequelize.Op.or]: [
            {
              senderId: req.user.id,
            },
            {
              receiverId: req.user.id,
            },
          ],
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['displayName', 'fullName'],
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['displayName', 'fullName'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  findThread: async (req, res) => {
    try {
      const { receiverId } = req.params;
      const thread = await Thread.findOne({
        where: {
          [Sequelize.Op.or]: [
            {
              senderId: req.user.id,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: req.user.id,
            },
          ],
        },
      });
      if (thread) {
        const messages = await Message.findAll({
          where: {
            threadId: thread.id,
          },
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              attributes: ['displayName', 'fullName'],
            },
          ],
        });
        return res.status(200).json({
          thread,
          messages,
        });
      }
      return res.status(200).json({
        thread: null,
        messages: [],
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
};
