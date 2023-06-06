import Joi from 'joi';

const schema = Joi.object({
  pickup: Joi.object()
    .keys({
      name: Joi.string().required(),
      coordinates: Joi.array().items(),
    })
    .required(),
  dateTime: Joi.date().required(),
  noOfPeople: Joi.number().max(8).required(),
  destination: Joi.object()
    .keys({
      name: Joi.string().required(),
      coordinates: Joi.array().items(),
    })
    .required(),
  carType: Joi.string().required(),
  fare: Joi.number().required(),
  dispatcherId: Joi.string().allow(null, '').optional(),
  guestName: Joi.string().required(),
  notes: Joi.string().allow(null, '').optional(),
  guestPhoneNumber: Joi.string().required(),
  flightNumber: Joi.string().allow(null, '').optional(),
  nameCaller: Joi.string().allow(null, '').optional(),
  driverId: Joi.string().allow(null, '').optional(),
  paymentType: Joi.string().required(),
  note: Joi.string().allow(null, '').optional(),
  clientId: Joi.string().allow(null, '').optional(),
});

const validate = async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body);
    if (error) {
      if (error.details && error.details.length && error.details[0].message) {
        return res.status(400).json({ msg: error.details[0].message });
      }
      return res.status(400).json({ msg: error.message });
    }
    return next();
  } catch (error) {
    if (error.details && error.details.length && error.details[0].message) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    return res.status(400).json({ msg: error.message });
  }
};

export default validate;
