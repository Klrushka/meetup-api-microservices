import Joi from 'joi';

export const meetupValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    tags: Joi.array(),
    dueTime: Joi.date(),
    userId: Joi.string().optional(),   
    location: Joi.object().optional(),      
   
});