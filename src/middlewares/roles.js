import Models from '../models';

const { User } = Models;
const driver = (req, res, next) => {
  if (
    (req.user.role === 'Driver' || req.user.role === 'Admin')
    && !req.user.block
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Access denied. Only Driver use this route.' });
};

const dispatcher = (req, res, next) => {
  if (
    (req.user.role === 'Dispatcher' || req.user.role === 'Admin')
    && !req.user.block
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Access denied. Only Dispatcher use this route' });
};

const organization = (req, res, next) => {
  if (
    (req.user.role === 'Organization' || req.user.role === 'Admin')
    && !req.user.block
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Access denied. Only Company use this route.' });
};

const superAdmin = (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Admin rights needed to acces this API.' });
};

const companyDispatcherBooking = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });
  if (
    (user.role === 'Organization'
      || user.role === 'Admin'
      || user.role === 'Dispatcher')
    && !user.block
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Admin rights needed to acces this API.' });
};
const driverDispatcher = (req, res, next) => {
  if (
    req.user.role === 'Driver'
    || (req.user.role === 'Dispatcher' && !req.user.block)
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: 'Access denied. You are not Driver nor Dispatcher' });
};

export {
  driver,
  dispatcher,
  organization,
  superAdmin,
  companyDispatcherBooking,
  driverDispatcher,
};
