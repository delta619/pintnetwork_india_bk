const Donor = require("../models/donorModel")
const Patient = require("../models/patientModel");
const sendEmail = require('./../utils/email');
const { match, isMatch } = require('../utils/matchPeople')

module.exports = async()=>{

    console.log(`Matching started at ${new Date()}`);


    const [donors, patients] = await Promise.all([
        Donor.find({
            healthy:true,
            matchedEarlier:0,
        }),
        Patient.find({
            matchedEarlier:0
        })
    ])

    console.log("Donors found are ",donors.length);
    console.log("Patients found are ",patients.length);
    

    // Set a property of tempory match to prevent duplicasy in for loop, which is after the query. (local match);
    
  
    


    // sort donors
    donors.sort((a, b) => (new Date(a.registeredAt).getTime() > new Date(b.registeredAt).getTime() ) ? 1 : -1)


    // sort patients

    patients.sort((a, b) => (new Date(a.registeredAt).getTime() > new Date(b.registeredAt).getTime() ) ? 1 : -1)


    let matches = 0;

    for (let i = 0 ; i < donors.length ; i++){
        donors[i].tempMatchKey = 0;
    }
    for (let i = 0 ; i < patients.length ; i++){
        patients[i].tempMatchKey = 0;
    }


    for(let p = 0 ; p < patients.length ; p++){
        for(let d = 0 ; d < donors.length ; d++){
            
            currentDonor = donors[d];
            currentPatient = patients[p];
          
            console.log(`Checking ${currentDonor.blood} and ${currentPatient.blood}`);
              
            if(currentDonor.tempMatchKey == 1 || currentPatient.tempMatchKey == 1){
                continue;
            }
            
            if(isMatch(currentDonor, currentPatient)){

                console.log(`key was ${currentDonor.tempMatchKey} and ${currentPatient.tempMatchKey}`);
                

                matches++;

                donors[d].tempMatchKey = 1;
                patients[p].tempMatchKey = 1;    

                console.log(`Donor and Patient matched are ${currentDonor._id} and ${currentPatient._id}`);

                try{
                    await Promise.all([
                        Donor.findByIdAndUpdate(currentDonor._id,{
                            matchedEarlier:true,
                            matchedTo:currentPatient._id
                        }),
                    await  Patient.findByIdAndUpdate(currentPatient._id,{
                            matchedEarlier:true,
                            matchedTo:currentDonor._id
                        }),
                    ])

                }catch(err){

                    donors[d].tempMatchKey = 0;
                    patients[p].tempMatchKey = 0;    

                    console.log("The Match couldnt happen at DB, so resetting their local match. ",err);

                    return;
                }
                

                
                match(currentDonor ,currentPatient);
            }
        }

    }

    console.log(`Total matches `,matches)
    

    

    




}
