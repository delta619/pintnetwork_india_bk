const { sendErrorMail } = require('./emailController');

module.exports = async (err, req, res, next) => {
  console.log(err);

  if (process.env.NODE_ENV == 'production') {
    err.message = 'Something went wrong';

    sendErrorMail(err);
  }

  res.json({
    status: 500,
    message: err.message,
  });
};
