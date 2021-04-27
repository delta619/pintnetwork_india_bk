const nodemailer = require('nodemailer');
const path = require('path');



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.NODE_ENV == "production"?true:false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});


exports.sendEmailPlain =  (options) => {

  const mailOptions = {
    from: 'Pint Network <admin@pintnetwork.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
    envelope: {
      from: 'Pint Network <admin@pintnetwork.com>',
      to: options.email
    }
  }
  return transporter.sendMail(mailOptions);
}


exports.sendEmailWithAttachments = async options => {

  const mailOptions = {
    from: 'Pint Network <admin@pintnetwork.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments,
    envelope: {
      from: 'Pint Network <admin@pintnetwork.com>',
      to: options.email
    }
  }
  try{
    await  transporter.sendMail(mailOptions);
  }catch(e){
    throw e
  }

}

