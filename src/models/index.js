import DB from '../db';
import OnBoardingModel from './onboarding';
import UserModel from './users';
import BrandModel from './brand';
import CarModel from './car';
import BookingModel from './booking';
import PaymentModel from './paymentHistory';
import CompanyDetailsModel from './companyDetails';
import ClientModel from './client';
import CustomerDispatchersModel from './customer_disptachers';
import ConversationModel from './conversation';
import MessageModel from './message';

const { sequelize } = DB;

const User = UserModel(sequelize);
const Brand = BrandModel(sequelize);
const Car = CarModel(sequelize);
const Booking = BookingModel(sequelize);
const Payment = PaymentModel(sequelize);
const CompanyDetails = CompanyDetailsModel(sequelize);
const OnBoarding = OnBoardingModel(sequelize);
const Client = ClientModel(sequelize);
const CustomerDispatchers = CustomerDispatchersModel(sequelize);
const Thread = ConversationModel(sequelize);
const Message = MessageModel(sequelize);

User.hasMany(OnBoarding, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
  as: 'vehicle',
});
OnBoarding.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
});
Brand.hasMany(Car, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'brandId',
});
Car.belongsTo(Brand, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'brandId',
});
User.hasMany(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
});
User.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
});
User.hasMany(Booking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'dispatcherId',
});
Booking.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: {
    name: 'dispatcherId',
    allowNull: true,
  },
  as: 'dispatcher',
});
User.hasMany(Booking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'driverId',
});
Booking.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'driverId',
  as: 'driver',
});
User.hasMany(Booking, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
});
Booking.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'userId',
  as: 'company',
});
User.hasMany(Payment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Payment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.hasOne(CompanyDetails, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CompanyDetails.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Car.hasMany(OnBoarding, {
  foreignKey: 'carId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OnBoarding.belongsTo(Car, {
  foreignKey: 'carId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Brand.hasMany(OnBoarding, {
  foreignKey: 'brandId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OnBoarding.belongsTo(Brand, {
  foreignKey: 'brandId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasMany(Client, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Client.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Client.hasMany(Booking, {
  foreignKey: 'clientId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Booking.belongsTo(Client, {
  foreignKey: 'clientId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Client.hasMany(CustomerDispatchers);
CustomerDispatchers.belongsTo(Client);

User.hasMany(CustomerDispatchers);
CustomerDispatchers.belongsTo(User);

Thread.belongsTo(User, {
  foreignKey: 'senderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'sender',
});

Thread.belongsTo(User, {
  foreignKey: 'receiverId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'receiver',
});

Message.belongsTo(Thread, {
  foreignKey: 'threadId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Message.belongsTo(User, {
  foreignKey: 'senderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Thread.hasMany(Message, {
  foreignKey: 'threadId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default {
  User,
  Brand,
  Car,
  Booking,
  Payment,
  CompanyDetails,
  OnBoarding,
  Client,
  CustomerDispatchers,
  Thread,
  Message,
};
