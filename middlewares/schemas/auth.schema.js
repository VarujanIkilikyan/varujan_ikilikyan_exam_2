import Joi from 'joi';

export default {
    register: Joi.object({
        username: Joi.string().alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(32).required(),
        age: Joi.number().integer().min(16).max(120).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(32).required()
    })
};