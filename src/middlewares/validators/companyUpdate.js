import Joi from 'joi';

const schema = Joi.object({
  displayName: Joi.string().trim().min(3).required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  addressLineTwo: Joi.string().allow(null, '').optional(),
  postalCode: Joi.string().required(),
  activeCity: Joi.string().required(),
  IBAN: Joi.string().required(),
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
