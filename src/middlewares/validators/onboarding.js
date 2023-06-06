import Joi from 'joi';

const schema = Joi.object({
  carId: Joi.string().required(),
  brandId: Joi.string().required(),
  numberPlate: Joi.string().required(),
  insuranceDocument: Joi.object({
    expiry: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
  licenseCard: Joi.object({
    expiry: Joi.string().required(),
    frontImage: Joi.string().required(),
    backImage: Joi.string().required(),
  }),
  vehicleCard: Joi.object({
    expiry: Joi.string().required(),
    frontImage: Joi.string().required(),
    backImage: Joi.string().required(),
  }).required(),
  pictures: Joi.object({
    frontImage: Joi.string().required(),
    backImage: Joi.string().required(),
    sideImage: Joi.string().required(),
  }).required(),
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
