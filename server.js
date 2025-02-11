import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/api.js';
import syncDatabase from './config/sync.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed by CORS'));
    }
  },
  credentials: true,
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

syncDatabase()
  .then(() => {
    console.log('Database Synched. Starting Server...');
    app.use(routes);

    app.all('*', (req, res) => {
      res.status(404);
      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
      } else if (req.accepts('json')) {
        res.json({ 'error': '404 Not Found' });
      } else {
        res.type('txt').send('404 Not Found');
      }
    });

    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
  })
  .catch((error) => {
    console.error('Database Synch Failed', error);
  });