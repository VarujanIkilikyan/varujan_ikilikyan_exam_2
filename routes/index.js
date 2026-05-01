import  authRouter from './auth.js';
import  booksRouter from './books.js';
import {Router} from 'express';

const selectorRouter = Router();


selectorRouter.get('/', (req, res) => {
    res.json({ message: "Welcome to the Book Library API" });
});
selectorRouter.use('/auth', authRouter);
selectorRouter.use('/books', booksRouter);

export default selectorRouter;