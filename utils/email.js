const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  // secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});    



exports.sendText = async options =>{ 

    const mailOptions = {
        from: 'Pint Network <admin@pintnetwork.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        envelope: {
        from: 'Pint Network <admin@pintnetwork.com>',
        to: options.email 
      }
    }
  await transporter.sendMail(mailOptions);
}


exports.sendDonorAttachment = async options =>{ 


  let DonorAttachment = path.join(__dirname , ".." , "userdata" , "emails", `${options.donor.contact}.pdf`);

  const mailOptions = {
      from: 'Pint Network <admin@pintnetwork.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      attachments:[{
        filename:"DonorForm.pdf",
        path:DonorAttachment,
      }],
      envelope: {
        from: 'Pint Network <admin@pintnetwork.com>', 
        to: options.email 
    }
  }

await transporter.sendMail(mailOptions);
}

