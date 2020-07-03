const nodemailer = require('nodemailer');

const sendEmail = async options =>{ 
    // 1 create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });      

    // 2 define the email option

    const mailOptions = {
        from: 'Pint Network <admin@pintnetwork.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,

        // attachments:[{
        //   filename:"DonorForm.pdf",
        //   path:options.attachment,
        // }],

        envelope: {
          from: 'Pint Network <admin@pintnetwork.com>', // used as MAIL FROM: address for SMTP
          to: options.email // used as RCPT TO: address for SMTP
      }
    }

    // 3 Actually send the email
    

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;