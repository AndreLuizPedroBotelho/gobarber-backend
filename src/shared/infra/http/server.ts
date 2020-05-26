import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import GlobalError from '@shared/errors/GlobalError';
import routes from '@shared/infra/http/routes';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(GlobalError);

app.listen(process.env.APP_API_PORT, () => {
  console.log(`Server started on port ${process.env.APP_API_PORT}!`);
});
