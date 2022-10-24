import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import {
  loginValidator,
  registrationValidator,
} from '../services/validators/shemas/request.validators';

const validator =
  (validator: Joi.ObjectSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = validator.validate(req.body);

    if (error) {
      next(error);
    }
    next();
  };

export default {
  validateLogin: validator(loginValidator),
  validateRegistration: validator(registrationValidator),
};
