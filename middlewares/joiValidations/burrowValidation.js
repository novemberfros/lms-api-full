import Joi from "joi";

import { buildErrorResponse } from "../../utility/responseHelper.js";

const SORT_STR = Joi.string();
const SORT_STR_REQUIRED = Joi.string().max(100).required();
const LONG_STR = Joi.string().max(500);
const LONG_STR_REQUIRED = Joi.string().max(5000).required();
const NUMBER = Joi.number();
const NUMBER_REQUIRED = Joi.number().required();

export const newBurrowValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      book_id: SORT_STR_REQUIRED,
      book_name: SORT_STR_REQUIRED,
      user_id: SORT_STR_REQUIRED,
      user_name: SORT_STR_REQUIRED,
      due_date: Joi.date(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return buildErrorResponse(res, error.message)
    }

    next()
  } catch (error) {
    next(error)
  }
};