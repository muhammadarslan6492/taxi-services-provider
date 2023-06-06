import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path from 'path';
import { BadRequest, Conflict } from 'fejl';
import Sequelize from 'sequelize';

import Model from '../models';
import sendEmail from '../helpers/mailSender/signup';
import passwordRestMail from '../helpers/mailSender/psswordRest';
import cacheService from '../cache';
import notification from '../helpers/pushNotifications';

config();

const {
  User,
  OnBoarding,
  CompanyDetails,
  Car,
  Brand,
} = Model;

const saltRounds = 10;

function CheckIsValidDomain(domain) {
  const re = new RegExp(
    /^((?:(?:(?:\w[.\-+]?)*)\w)+)((?:(?:(?:\w[.\-+]?){0,62})\w)+)\.(\w{2,6})$/,
  );
  return domain.match(re);
}

const generatePassword = () => {
  const length = 6;
  const charset = '0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export default {
  signupMobile: async (req, res) => {
    try {
      const { body } = req;
      if (body.displayName.indexOf(' ') >= 0) {
        throw new BadRequest('spaceses not allowed in DisplayName');
      }
      const existingUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { displayName: body.displayName },
            { email: body.email },
          ],
        },
      });
      if (existingUser) {
        throw new Conflict('DispalyName or email already taken');
      }
      const password = await bcrypt.hash(body.password, saltRounds);
      body.password = password;
      body.role = 'Driver';
      const user = await User.create(body);
      const emailStatus = await sendEmail(user.email, user.toJSON());
      if (emailStatus) {
        return res.status(201).json(user);
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  verify: async (req, res) => {
    try {
      const { JWT } = req.params;
      const decoded = jwt.verify(JWT, process.env.JWT);
      const user = await User.findOne({
        where: {
          id: decoded.id,
          verified: false,
        },
      });
      if (user) {
        user.verified = true;
        await user.save();
        return res.sendFile(path.join(__dirname, '..', 'html', 'success.html'));
      }
      return res.sendFile(path.join(__dirname, '..', 'html', 'error.html'));
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res.render('pages/resend', {
          jwt: `${process.env.URL}/api/user/resend/${req.params.JWT}`,
        });
      }
      return res.sendFile(
        path.join(__dirname, '..', 'html', 'general-error.html'),
      );
    }
  },
  resend: async (req, res) => {
    try {
      const { JWT } = req.params;
      const decoded = jwt.decode(JWT);
      let user = await User.findOne({
        where: {
          id: decoded.id,
          verified: false,
        },
      });
      if (user) {
        user = user.toJSON();
        delete user.password;
        sendEmail(user.email, user);
        return res.render('pages/success', {
          msg: `Verification email sent to ${user.email}`,
        });
      }
      return res.sendFile(path.join(__dirname, '..', 'html', 'error.html'));
    } catch (err) {
      return res.sendFile(
        path.join(__dirname, '..', 'html', 'general-error.html'),
      );
    }
  },
  loginMobile: async (req, res) => {
    try {
      const { body } = req;
      body.lastLogin = Date.now();
      let user = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { displayName: body.displayName },
            { email: body.displayName },
          ],
        },
        attributes: { exclude: ['passwordRestToken', 'passwordTokenExpire'] },
      });
      if (user) {
        if (user.onBoardingVerified === 'Approved') {
          const onboarding = await OnBoarding.findOne({
            where: { userId: user.id },
          });
          if (user.role === 'Admin' || user.role === 'Organization') {
            return res.status(409).json({
              msg: 'Admin or Company not able to loged-in in mobile app. ',
            });
          }
          await user.update({ lastLogin: Date.now() });
          if (user.verified) {
            const result = await bcrypt.compare(body.password, user.password);
            if (result) {
              user = user.toJSON();
              delete user.password;
              const token = jwt.sign(user, process.env.JWT);
              return res.status(200).json({ user, onboarding, token });
            }
            return res.status(409).json({ msg: 'Invalid username or password' });
          }
          return res.status(409).json({
            msg: "Your account isn't verified yet. Please verify your account.",
          });
        }
        if (!user.onBoardingVerified || user.onBoardingVerified === 'Pending' || user.onBoardingVerified === 'Rejected') {
          if (user.role === 'Admin' || user.role === 'Organization') {
            return res.status(409).json({
              msg: 'Admin or Company not able to loged-in in mobile app. ',
            });
          }
          await user.update({ lastLogin: Date.now() });
          if (user.verified) {
            const result = await bcrypt.compare(body.password, user.password);
            if (result) {
              user = user.toJSON();
              delete user.password;
              const token = jwt.sign(user, process.env.JWT);
              return res.status(200).json({ user, token });
            }
            return res.status(409).json({ msg: 'Invalid username or password' });
          }
          return res.status(409).json({
            msg: "Your account isn't verified yet. Please verify your account.",
          });
        }
      }
      return res.status(409).json({ msg: 'Invalid username or password.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { body, user } = req;
      const userFound = await User.findOne({
        where: {
          id: user.id,
        },
      });
      if (!userFound) {
        throw new Conflict('User not found');
      }
      const result = await bcrypt.compare(body.oldPassword, userFound.password);
      if (!result) {
        throw new Conflict('Old password is incorrect');
      }
      const password = await bcrypt.hash(body.newPassword, saltRounds);
      await userFound.update({ password });
      return res.status(200).json({ msg: 'Password changed successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { body, user } = req;
      const userFound = await User.findOne({
        where: {
          id: user.id,
        },
      });
      if (!userFound) {
        throw new Conflict('User not found');
      }
      await userFound.update(body);
      return res.status(200).json({ user: userFound });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  webSignup: async (req, res) => {
    try {
      const { body } = req;
      if (body.displayName.indexOf(' ') >= 0) {
        throw new BadRequest('spaceses not allowed in DisplayName.');
      }
      const existingUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { displayName: body.displayName },
            { email: body.email },
            { companyName: body.companyName },
          ],
        },
      });
      if (existingUser) {
        throw new Conflict('DisplayName, email or Company Name already taken');
      }
      const password = await bcrypt.hash(body.password, saltRounds);
      body.password = password;
      const spaceLessDomain = body.companyName.replace(/\s/g, '');
      body.domain = `${spaceLessDomain}.mobio.com`;
      body.role = 'Organization';
      const validDomain = CheckIsValidDomain(body.domain);
      if (validDomain) {
        const user = await User.create(body);
        CompanyDetails.create({
          logo: 'default logo',
          title: 'default title',
          headerText: 'default Header text',
          socialLinks: ['https://facebook.com', 'https://youtube.com'],
          userId: user.id,
        });
        await sendEmail(user.email, user.toJSON());
        return res.status(201).json(user);
      }
      return res
        .status(400)
        .json({ msg: 'Company name contain unwanted characters.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  webLogin: async (req, res) => {
    try {
      const { body } = req;
      let user = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { displayName: body.displayName },
            { email: body.displayName },
          ],
          role: {
            [Sequelize.Op.or]: ['Admin', 'Organization'],
          },
        },
        attributes: { exclude: ['passwordRestToken', 'passwordTokenExpire'] },
      });
      if (user) {
        await user.update({ lastLogin: Date.now() });
        if (user.verified) {
          const result = await bcrypt.compare(body.password, user.password);
          if (result) {
            user = user.toJSON();
            delete user.password;
            const token = jwt.sign(user, process.env.JWT);
            return res.status(200).json({ user, token });
          }
          return res.status(409).json({ msg: 'Invalid username or password' });
        }
        return res.status(409).json({
          msg: "Your account isn't verified yet. Please verify your account.",
        });
      }
      return res.status(409).json({ msg: 'Invalid username or password' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  upload: (req, res) => {
    try {
      return res.status(200).json({ url: req.file.location });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  profile: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        return res.status(403).json({ msg: 'forbiden' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addOnboarding: async (req, res) => {
    try {
      const { body } = req;
      const checkUser = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ['password'] },
      });
      if (!checkUser) {
        throw new Conflict('User not found.');
      }
      const exist = await OnBoarding.findOne({
        where: { userId: req.user.id },
      });
      if (exist) {
        body.licenseCard = {
          expiry: exist.licenseExpiry,
          frontImage: exist.licenseFront,
          backImage: exist.licenseBack,
        };
      }
      const onboardingObject = {
        insuranceExpiry: body.insuranceDocument.expiry,
        insuranceImage: body.insuranceDocument.image,
        licenseExpiry: body.licenseCard.expiry,
        licenseFront: body.licenseCard.frontImage,
        licenseBack: body.licenseCard.backImage,
        vehicleCardExpiry: body.vehicleCard.expiry,
        vehicleCardFront: body.vehicleCard.frontImage,
        vehicleCardBack: body.vehicleCard.backImage,
        pictureFront: body.pictures.frontImage,
        pictureBack: body.pictures.backImage,
        pictureSide: body.pictures.sideImage,
        numberPlate: body.numberPlate,
        userId: req.user.id,
        carId: req.body.carId,
        brandId: req.body.brandId,
        verify: 'Pending',
        isCurrent: body.isCurrent,
      };
      if (exist) {
        const updated = await checkUser.update({
          onBoardingVerified: 'Pending',
        });
        await OnBoarding.create(onboardingObject);
        return res.status(201).json(updated);
      }
      await OnBoarding.create(onboardingObject);
      return res.status(201).json(checkUser);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOnBoarding: async (req, res) => {
    try {
      const onboarding = await OnBoarding.findOne({
        where: { userId: req.user.id },
      });
      return res.status(200).json(onboarding);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getOnBoardings: async (req, res) => {
    try {
      if (req.user.role === 'Admin' || req.user.role === 'Organization') {
        return res.status(403).json({ msg: 'Only Driver and dispatcher can access this API.' });
      }
      const onBoardings = await OnBoarding.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            attributes: ['id', 'displayName', 'email', 'phoneNumber'],
          },
          {
            model: Car,
          },
          {
            model: Brand,
          },
        ],
      });
      return res.status(200).json(onBoardings);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateOnboarding: async (req, res) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        throw new Conflict('User not found');
      }
      const onboarding = await OnBoarding.findOne({
        where: { id },
      });
      if (onboarding && onboarding.verify === 'Rejected') {
        await onboarding.update({
          insuranceExpiry: body.insuranceDocument.expiry,
          insuranceImage: body.insuranceDocument.image,
          licenseExpiry: body.licenseCard.expiry,
          licenseFront: body.licenseCard.frontImage,
          licenseBack: body.licenseCard.backImage,
          vehicleCardExpiry: body.vehicleCard.expiry,
          vehicleCardFront: body.vehicleCard.frontImage,
          vehicleCardBack: body.vehicleCard.backImage,
          pictureFront: body.pictures.frontImage,
          pictureBack: body.pictures.backImage,
          pictureSide: body.pictures.sideImage,
          numberPlate: body.numberPlate,
          userId: req.user.id,
          carId: req.body.carId,
          brandId: req.body.brandId,
          verify: 'Pending',
        });
        if (onboarding.isCurrent) {
          await user.update({
            onBoardingVerified: 'Pending',
          });
        }
        return res
          .status(200)
          .json({ msg: 'Onboarding successfully updated.' });
      }
      if (onboarding && onboarding.verify === 'Pending') {
        await onboarding.update({
          insuranceExpiry: body.insuranceDocument.expiry,
          insuranceImage: body.insuranceDocument.image,
          licenseExpiry: body.licenseCard.expiry,
          licenseFront: body.licenseCard.frontImage,
          licenseBack: body.licenseCard.backImage,
          vehicleCardExpiry: body.vehicleCard.expiry,
          vehicleCardFront: body.vehicleCard.frontImage,
          vehicleCardBack: body.vehicleCard.backImage,
          pictureFront: body.pictures.frontImage,
          pictureBack: body.pictures.backImage,
          pictureSide: body.pictures.sideImage,
          numberPlate: body.numberPlate,
          userId: req.user.id,
          carId: req.body.carId,
          brandId: req.body.brandId,
        });
        return res.status(200).json({ msg: 'Onboarding successfully updated.' });
      }
      return res.status(409).json({ msg: 'You cannot edit an approved onboarding' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      const { headers } = req;
      const token = headers.authorization.split(' ')[1];
      const blackListedTokens = (await cacheService.getAsync('blackListedTokens')) || [];
      await cacheService.setObjAsync(
        'blackListedTokens',
        [...blackListedTokens, token],
        3600,
      );
      await User.update({ online: false, pushToken: null }, { where: { id: req.user.id } });
      req.io.emit('user-removed', { id: req.user.id });
      return res.status(200).json({ msg: 'User logged out successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  companyDetail: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { domain: req.params.domain },
      });
      const companyDetails = await CompanyDetails.findOne({
        where: { userId: user.id },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
      });
      return res.status(200).json(companyDetails);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        throw new Conflict('Email not valid');
      }
      const resetToken = generatePassword();
      user.passwordRestToken = resetToken;
      user.passwordTokenExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
      await passwordRestMail(user.email, resetToken);
      return res.status(200).json({
        msg: 'Check your provided e-mail. Token will be expired after 10 minutes. ',
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const date = Date.now();
      const user = await User.findOne({
        where: { passwordRestToken: req.params.token },
      });
      if (user) {
        if (user.passwordTokenExpire > date) {
          user.password = await bcrypt.hash(req.body.password, saltRounds);
          user.passwordRestToken = null;
          user.passwordTokenExpire = null;
          await user.save();
          return res.status(200).json({ msg: 'Password successfully changed' });
        }
        throw new Conflict('Token expire.');
      }
      throw new Conflict('Invalid token.');
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getLocations: async (req, res) => {
    try {
      let where = {};
      if (req.user.role === 'Driver') {
        return res.status(200).json([]);
      }
      if (req.user.role === 'Dispatcher') {
        where = {
          role: {
            [Sequelize.Op.or]: ['Driver', 'Dispatcher'],
          },
          status: {
            [Sequelize.Op.or]: ['available', 'onbooking'],
          },
          online: true,
          onBoardingVerified: 'Approved',
        };
      } else {
        return res.status(403).json({ msg: 'You are not authorized' });
      }
      const locations = await User.findAll({
        where,
        attributes: ['id',
          'fullName',
          'displayName',
          'role',
          'phoneNumber',
          'lat',
          'lng',
          'status',
        ],
        include: [
          {
            model: OnBoarding,
            where: { isCurrent: true },
            attributes: ['id', 'numberPlate'],
            include: [
              {
                model: Car,
              }, {
                model: Brand,
              },
            ],
            as: 'vehicle',
          },
        ],
      });
      // console.log(locations);
      return res.status(200).json(locations);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  selectCurrentOnboarding: async (req, res) => {
    try {
      const { id } = req.params;
      const onBoarding = await OnBoarding.findOne({
        where: { id },
      });
      if (onBoarding && onBoarding.verify === 'Approved') {
        await OnBoarding.update({ isCurrent: true }, { where: { id } });
        await OnBoarding.update({ isCurrent: false }, {
          where: {
            userId: req.user.id,
            id: {
              [Sequelize.Op.ne]: id,
            },
          },
        });
        return res.status(200).json({ msg: 'Onboarding selected successfully' });
      }
      return res.status(409).json({ msg: 'Cannot select this as current onboarding as it is not verified yet.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePushToken: async (req, res) => {
    try {
      const { pushToken } = req.body;
      await User.update({ pushToken }, { where: { id: req.user.id } });
      return res.status(200).json({ msg: 'Push token updated successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  testNotification: async (req, res) => {
    try {
      const { id } = req.params;
      await notification.sendPushNotificationToToken(id, 'Mobio App Test', 'Test notification');
      return res.status(200).json({ msg: 'Notification sent successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  checkDisplayName: async (req, res) => {
    try {
      const { displayName } = req.body;
      const user = await User.findOne({ where: { displayName } });
      if (user) {
        throw new Conflict('Display name already taken');
      }
      return res.status(200).json({ msg: 'Display name available' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
