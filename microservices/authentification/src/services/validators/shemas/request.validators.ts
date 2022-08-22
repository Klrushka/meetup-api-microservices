import joi from 'joi'

export const loginValidator = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
})

export const registrationValidator = joi.object({
    name: joi.string().required(),
    surname: joi.string().required(),
    telephone: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
})