import MobileSinupMiddleware from './signupMobile';
import MobileLoginMiddleware from './loginMobile';
import WebSignupMiddleware from './signupWeb';
import WebLoginMiddleware from './webLogin';
import OnboardingMiddleware from './onboarding';
import BrandMiddleware from './brand';
import CarMiddleware from './car';
import BookingMiddleware from './booking';
import DriverStatus from './driverStatus';
import ChatMideleware from './chat';
import AssignLocationByAdmin from './assignLocationAdmin';
import RejectByAdminMiddleware from './adminRejectOnBoading';
import CarUpdateMiddleware from './carUpdate';
import CompanyUpdateMiddleware from './companyUpdate';
import ClientCreationMiddleware from './client';
import MessageValidator from './messageValidator';

export default {
  MobileSinupMiddleware,
  MobileLoginMiddleware,
  WebSignupMiddleware,
  WebLoginMiddleware,
  OnboardingMiddleware,
  BrandMiddleware,
  CarMiddleware,
  BookingMiddleware,
  DriverStatus,
  ChatMideleware,
  AssignLocationByAdmin,
  RejectByAdminMiddleware,
  CarUpdateMiddleware,
  CompanyUpdateMiddleware,
  ClientCreationMiddleware,
  MessageValidator,
};
