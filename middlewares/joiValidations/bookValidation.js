import Joi from "joi";

import { buildErrorResponse } from "../../utility/responseHelper.js";

const SORT_STR = Joi.string();
const SORT_STR_REQUIRED = Joi.string().max(100).required();
const LONG_STR = Joi.string().max(500);
const LONG_STR_REQUIRED = Joi.string().max(5000).required();
const NUMBER = Joi.number();
const NUMBER_REQUIRED = Joi.number().required();

export const newBookValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      thumbnail: LONG_STR_REQUIRED,
      title: SORT_STR_REQUIRED,
      author: SORT_STR_REQUIRED,
      publish_year: SORT_STR_REQUIRED,
      isbn: SORT_STR_REQUIRED,
      description: LONG_STR_REQUIRED,
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

export const updateBookValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      _id: SORT_STR_REQUIRED,
      thumbnail: LONG_STR_REQUIRED,
      title: SORT_STR_REQUIRED,
      author: SORT_STR_REQUIRED,
      publish_year: SORT_STR_REQUIRED,
      isbn: SORT_STR_REQUIRED,
      description: LONG_STR_REQUIRED,
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