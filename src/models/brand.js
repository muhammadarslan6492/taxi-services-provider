import { DataTypes } from 'sequelize';

const BrandModel = (sequelize) => {
  const brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    brandName: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Brand',
  });
  return brand;
};
export default BrandModel;
