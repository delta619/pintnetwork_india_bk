const axios = require('axios');

exports.sendWelcomeMessage = options =>{
     

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
          // console.log("res is ",res);
          
     },(err)=>{
          // console.log("error is ",err); 
     })
}

exports.sendMatchResponseDonor =async (data) =>{
     

     axios({
          method:'post',
          url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
          data:{
               From: 'PINTNW',
               To:data.to,
               TemplateName:'to_donor_match',
               VAR1:data.var1,  //Name
               VAR2:data.var2,  //Name
          }
     }).then((res)=>{
          return true;
     },(err)=>{
          throw err;          
     })
}

exports.sendMatchResponsePatient =async (data) =>{
     

     axios({
          method:'post',
          url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
          data:{
               From: 'PINTNW',
               To:data.to,
               TemplateName:'to_patient_matched_otp',
               VAR1:data.var1,  //Name
               VAR2:data.var2,  //his/her
               VAR3:data.var3,  //name donor
               VAR4:data.var4,  //contact donor
               VAR5:data.var5,  //email donor
               VAR6:data.var6   //
          }
     }).then((res)=>{
          return true;
     },(err)=>{
          throw err;          
     })
}

