import { DataTypes } from 'sequelize';

const PaymentModel = (sequelize) => {
  const payment = sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
      },
      amount: {
        type: DataTypes.STRING,
        defaultValue: 0,
      },
    },
    {
      tableName: 'Payment',
    },
  );
  return payment;
};
export default PaymentModel;
