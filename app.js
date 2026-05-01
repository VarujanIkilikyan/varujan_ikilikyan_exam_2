import express from 'express';
import 'dotenv/config.js'
import {createServer} from 'http'

const app = express();
const {PORT} = process.env || 3000;

const server = createServer(app)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
