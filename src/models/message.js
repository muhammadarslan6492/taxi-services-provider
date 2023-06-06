import { DataTypes } from 'sequelize';

const MessageModel = (sequelize) => {
  const message = sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      message: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'Message',
    },
  );
  return message;
};
export default MessageModel;
