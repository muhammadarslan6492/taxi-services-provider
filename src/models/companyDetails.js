import { DataTypes } from 'sequelize';

const CompanyDetails = (sequelize) => {
  const companyDetails = sequelize.define(
    'Car',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      logo: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      headerText: {
        type: DataTypes.STRING,
      },
      socialLinks: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: 'CompanyDetails',
    },
  );
  return companyDetails;
};
export default CompanyDetails;
