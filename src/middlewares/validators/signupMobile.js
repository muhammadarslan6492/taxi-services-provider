import Joi from 'joi';

const schema = Joi.object({
  displayName: Joi.string().trim().min(3).required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  addressLineTwo: Joi.string().allow(null, '').optional(),
  postalCode: Joi.string().alphanum().required(),
  city: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(8).required(),
  activeCity: Joi.string().required(),
  activeCountry: Joi.string(),
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
