import Joi from "joi";

import { buildErrorResponse } from "../../utility/responseHelper.js";

export const newUserValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      first_name: Joi.string().min(3).required(),
      last_name: Joi.string().required(),
      email: Joi.string().email({minDomainSegments: 2 }).required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
    })

    const { error } = schema.validate(req.body) // return an object with error from validate function
    if(error) {
      return buildErrorResponse(res, error.message)
    }

    next()
  } catch (error) {
    console.log(error);
  }
}