
import Joi from 'joi';

const currentYear = new Date().getFullYear();

export default {
    create: Joi.object({
        title: Joi.string().min(1).max(200).required(),
        author: Joi.string().min(1).max(100).required(),
        year: Joi.number().integer().min(1000).max(currentYear).required(),
        genre: Joi.string()
            .valid('fiction', 'non-fiction', 'science', 'history', 'fantasy', 'mystery', 'biography', 'other')
            .required()
    }),
    update: Joi.object({
        title: Joi.string().min(1).max(200).required(),
        author: Joi.string().min(1).max(100).required(),
        year: Joi.number().integer().min(1000).max(currentYear).required(),
        genre: Joi.string()
            .valid('fiction', 'non-fiction', 'science', 'history', 'fantasy', 'mystery', 'biography', 'other')
            .required()
    })
};