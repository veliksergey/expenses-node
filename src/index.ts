import 'reflect-metadata';
import {createConnection} from 'typeorm';
import express, {Application} from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
const path = require('path');
import cors from 'cors';

import Router from './routes';
import dbConfig from '../ormconfig';

const PORT = process.env.PORT || 8008;

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

// ToDo: change CORS policy?
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  }),
);

const uploadDir = path.join(__dirname + '../../uploads');
app.use(express.static(uploadDir));

app.use(Router);

createConnection(dbConfig).then(connection => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to db', err);
  process.exit(1);
});