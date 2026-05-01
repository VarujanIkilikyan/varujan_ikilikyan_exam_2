import express from 'express';
import 'dotenv/config.js'
import {createServer} from 'http'
import path from 'path'
import morgan from 'morgan'

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const {PORT} = process.env || 3000;

const server = createServer(app)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
