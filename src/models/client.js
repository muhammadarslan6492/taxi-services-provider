import { DataTypes } from 'sequelize';

const ClientModel = (sequelize) => {
  const client = sequelize.define('client', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    firstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'Client',
  });
  return client;
};
export default ClientModel;
