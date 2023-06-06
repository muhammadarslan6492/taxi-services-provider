import Joi from 'joi';

const schema = Joi.object({
  displayName: Joi.string().trim().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  companyName: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  addressLineTwo: Joi.string().allow(null, '').optional(),
  postalCode: Joi.string().required(),
  activeCity: Joi.string().required(),
  activeCountry: Joi.string(),
  IBAN: Joi.string().required(),
  domain: Joi.string(),
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
