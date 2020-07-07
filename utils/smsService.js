const axios = require('axios');

exports.sendWelcomeMessage = async (person) =>{
     
     try {
          await axios({
               method:'post',
               url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
               data:{
                    From: 'PINTNW',
                    To:person.contact,
                    TemplateName:'greeting_v2',
                    VAR1:person.name
               }
          })
     } catch (error) {
          throw error
     }

}

exports.unhealthy_donor_greeting = async (donor) =>{
     

     await axios({
          method:'post',
          url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
          data:{
               From: 'PINTNW',
               To:donor.contact,
               TemplateName:'unhealthy_donor_greeting',
               VAR1:donor.name
          }
     }).then((res)=>{
          return true
     },(err)=>{
          throw Error(err)
     })
}

exports.unhealthy_patient_greeting = async (patient) =>{
     

     await axios({
          method:'post',
          url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
          data:{
               From: 'PINTNW',
               To:patient.contact,
               TemplateName:'unhealthy_patient_greeting',
               VAR1:patient.name
          }
     }).then((res)=>{
          return true
     },(err)=>{
          throw Error(err)
     })
}

exports.sendMatchResponseDonor =async (data) =>{
     
     try {
          axios({
               method:'post',
               url:`http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
               data:{
                    From: 'PINTNW',
                    To:data.to,
                    TemplateName:'to_donor_match',
                    VAR1:data.var1,  
                    VAR2:data.var2,  
               }
          })
     } catch (err) {
          throw err
     }
}

exports.sendMatchResponsePatient =async (data) =>{
     
     try {
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
          })
     } catch (error) {
          throw error
     }

}