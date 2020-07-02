const axios = require('axios');

exports.sendWelcomeMessage = options =>{

console.log("Options are ",options);



     axios({
          method:'post',
          url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
          data:{
               From: 'PINTNW',
               To:options.contact,
               TemplateName:'register-NAME',
               VAR1:options.name
          }
     }).then((res)=>{
          console.log("res is ",res);
          
     },(err)=>{
          console.log("error is ",err);
          
     })

}
