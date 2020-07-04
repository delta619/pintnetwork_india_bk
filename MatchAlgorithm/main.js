const Donor = require("../models/donorModel")
const Patient = require("../models/patientModel");
const sendEmail = require('./../utils/email');
const { match, isMatch } = require('../utils/matchPeople')

module.exports = async () => {

    const [donors, patients] = await Promise.all([
        Donor.find({
            healthy: true,
            matchedEarlier: false,
        }),
        Patient.find({
            matchedEarlier: false
        })
    ])

    console.log(`Got ${donors.length} and ${patients.length} `);

    // Set a property of temporary match to prevent duplicasy in for-loop, which is after the query. (local match);

    // sort donors
    donors.sort((a, b) => (new Date(a.registeredAt).getTime() > new Date(b.registeredAt).getTime()) ? 1 : -1)


    // sort patients

    patients.sort((a, b) => (new Date(a.registeredAt).getTime() > new Date(b.registeredAt).getTime()) ? 1 : -1)


    let matches = 0;

    // Setting global not-matched for every eligible candidate

    for (let i = 0; i < donors.length; i++) {
        donors[i].matched = false;
    }
    for (let i = 0; i < patients.length; i++) {
        patients[i].matched = false;
    }

    let loopTurn = 0;

    for (let p = 0; p < patients.length; p++) {
        for (let d = 0; d < donors.length; d++) {
     
     
            console.log(`Combination ${donors[d].blood} and ${patients[p].blood}`);

            if (donors[d].matched || patients[p].matched ) {
                continue;
            }

            if (isMatch(donors[d], patients[p])) {

                console.log(`key was ${donors[d].matched} and ${patients[p].matched}`);


                matches++;

                donors[d].matched = true;
                patients[p].matched = true;

                console.log(`Donor and Patient matched are ${donors[d].name} and ${patients[p].name}`);

                try {
                    await Promise.all([
                        Donor.findByIdAndUpdate(donors[d]._id, {
                            matchedEarlier: true,
                            matchedTo: patients[p]._id
                        })
                        ,
                        Patient.findByIdAndUpdate(patients[p]._id, {
                            matchedEarlier: true,
                            matchedTo: donors[d]._id
                        }),
                    ])

                } catch (err) {

                    donors[d].matched = false;
                    patients[p].matched = false;

                    console.log("The Match couldnt happen at DB, so resetting their local match. ", err);

                }



                match(donors[d], patients[p]);
            }
        }

    }

    console.log(`Total matches `, matches)









}
