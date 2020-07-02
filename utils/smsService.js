const axios = require('axios');

const sendMsgTo = async options =>{

console.log("Options are ",options);



     await axios.get(`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/SMS/${options.contact}/${options.otp}`)

}

module.exports = sendMsgTo
