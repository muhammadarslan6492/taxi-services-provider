import { DataTypes } from 'sequelize';

const CarModel = (sequelize) => {
  const car = sequelize.define('Car', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    carName: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    seatingCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Car',
  });
  return car;
};
export default CarModel;
