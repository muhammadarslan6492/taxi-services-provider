import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  const user = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      addressLineTwo: {
        type: DataTypes.STRING,
      },
      postalCode: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['Driver', 'Dispatcher', 'Organization', 'Admin'],
      },
      country: {
        type: DataTypes.STRING,
      },
      activeCountry: {
        type: DataTypes.STRING,
        defaultValue: 'Netherlands',
      },
      activeCity: {
        type: DataTypes.STRING,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      domain: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      block: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.STRING,
      },
      lat: {
        type: DataTypes.STRING,
      },
      lng: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['occupied', 'available'],
        defaultValue: 'available',
      },
      IBAN: {
        type: DataTypes.STRING,
      },
      onBoardingVerified: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Approved', 'Rejected'],
      },
      passwordRestToken: {
        type: DataTypes.STRING,
      },
      passwordTokenExpire: {
        type: DataTypes.DATE,
      },
      online: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      locationTimeStamp: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      pushToken: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'users',
      indexes: [
        {
          unique: true,
          fields: ['displayName'],
        },
        {
          unique: true,
          fields: ['email'],
        },
        {
          unique: true,
          fields: ['companyName'],
        },
      ],
    },
  );
  return user;
};

export default UserModel;
