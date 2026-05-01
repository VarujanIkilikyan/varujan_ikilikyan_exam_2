import express from 'express';
import 'dotenv/config.js'
import {createServer} from 'http'
import path from 'path'
import morgan from 'morgan'

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const {PORT} = process.env || 3000;

app.use(routes);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler.notFound);
app.use(errorHandler.errors);
const server = createServer(app)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
