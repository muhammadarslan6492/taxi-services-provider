import { DataTypes } from 'sequelize';

const Conversation = (sequelize) => {
  const conversation = sequelize.define(
    'Conversation',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      lastMessage: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'Conversation',
    },
  );
  return conversation;
};
export default Conversation;
