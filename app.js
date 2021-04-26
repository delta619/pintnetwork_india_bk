const express = require('express');

const app = express();
const donorRoute = require('./routes/donorRoute');
const patietRoute = require('./routes/patientRoute');
const adminRoute = require('./routes/adminRoute');
const publicRoutes = require('./routes/publicRoute')

const Hit = require('./models/hitModel');

const globalErrorController = require('./controller/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
// GLOBAL
const {PintDataClass} = require('./utils/PintDataClass');
app.use(morgan('dev'));
// protect
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // MAX 100 requests in 1 hr
  message: 'Too many requests from your ip, Please try again in an hour',
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', limiter);
}

// BODY PARSER
app.use(express.json({ limit: '10kb' }));

// prevent NOSQL injection
app.use(mongoSanitize());

// prevent xss

app.use(xss());

// setting global cors

// if(process.env.NODE_ENV == "development"){
app.use(cors());
// }

// prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(express.urlencoded({ extended: true }));

// fetch initial data 
const p = new PintDataClass()

app.get('/api/addHit', async (req, res) => {
  if (process.env.NODE_ENV == 'production') {
    try {
      await Hit.create({
        hit: 1,
        data: JSON.stringify(req.headers),
      });
    } catch (error) {
      console.log(error);
    }
  }
  res.json({
    status: 200,
  });
});
app.use('/api/public', publicRoutes);
app.use('/api/donor', donorRoute);
app.use('/api/patient', patietRoute);
app.use('/api/admin', adminRoute);


app.all('*', (req, res, next) => {
  return res.status(204).end();
});

app.use(globalErrorController);

exports.Server = app;
