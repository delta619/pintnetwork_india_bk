const { sendErrorMail } = require('./emailController');

module.exports = async (err, req, res, next) => {
  if (err.isOperational) {
    sendErrorMail(err);
  } else {
    console.log('global error');
    sendErrorMail(err);
  }

  err.message = 'Something went wrong';

  return res.json({
    status: 500,
    message: err.message,
  });
};
