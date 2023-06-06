import { DataTypes } from 'sequelize';

const OnBoardingModel = (sequelize) => {
  const onboarding = sequelize.define(
    'OnBoarding',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      numberPlate: {
        type: DataTypes.STRING,
      },
      insuranceExpiry: {
        type: DataTypes.DATE,
      },
      insuranceImage: {
        type: DataTypes.STRING,
      },
      licenseExpiry: {
        type: DataTypes.DATE,
      },
      licenseFront: {
        type: DataTypes.STRING,
      },
      licenseBack: {
        type: DataTypes.STRING,
      },
      vehicleCardExpiry: {
        type: DataTypes.DATE,
      },
      vehicleCardFront: {
        type: DataTypes.STRING,
      },
      vehicleCardBack: {
        type: DataTypes.STRING,
      },
      pictureFront: {
        type: DataTypes.STRING,
      },
      pictureBack: {
        type: DataTypes.STRING,
      },
      pictureSide: {
        type: DataTypes.STRING,
      },
      verify: {
        type: DataTypes.ENUM,
        values: ['Approved', 'Rejected', 'Pending'],
      },
      isCurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'onboarding',
    },
  );
  return onboarding;
};

export default OnBoardingModel;
