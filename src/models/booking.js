import { DataTypes } from 'sequelize';

const BookingMOdel = (sequelize) => {
  const booking = sequelize.define(
    'Booking',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      pickup: {
        type: DataTypes.JSON,
      },
      dateTime: {
        type: DataTypes.DATE,
      },
      noOfPeople: {
        type: DataTypes.INTEGER,
      },
      carType: {
        type: DataTypes.ENUM,
        values: ['LUXURY', 'EXE_CARRIER', 'LARGE_CARRIER', 'CARRIER', 'MINI_BUS', 'EXECUTIVE', 'STANDARD'],
      },
      fare: {
        type: DataTypes.DOUBLE,
      },
      destination: {
        type: DataTypes.JSON,
      },
      guestName: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.STRING,
      },
      guestPhoneNumber: {
        type: DataTypes.STRING,
      },
      flightNumber: {
        type: DataTypes.STRING,
      },
      nameCaller: {
        type: DataTypes.STRING,
      },
      bookingStatus: {
        type: DataTypes.ENUM,
        values: ['Accepted', 'Rejected', 'Pending'],
        defaultValue: 'Pending',
      },
      positions: {
        type: DataTypes.JSON,
      },
      rideStart: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rideEnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rideInTransit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      refId: {
        type: DataTypes.UUID,
      },
      paymentType: {
        type: DataTypes.ENUM,
        values: ['CASH', 'CARD', 'ACCOUNT'],
      },
      cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancellationReason: {
        type: DataTypes.JSON,
      },

    },
    {
      tableName: 'Booking',
    },
  );
  return booking;
};
export default BookingMOdel;
