const PDFDocument = require('pdfkit');
const constants = require('../../constants');
const fs = require('fs');
const path = require('path');

let ques1 = "1. Name : "
let ques2 = "2. Age : "
let ques3 = "3. Gender : "
let ques4 = "4. Contact No. : "
let ques5 = "5. Email : "
let ques6 = "6. Have you ever been pregnant?"
let ques7 = "7. Weight :"
let ques8 = "8. Location : "
let ques9 = "9. Are you pregnant ? : "
let ques10 = "10. Have you obtained a tattoo or piercing in the last 12 months? : "
let ques11 = "11. Do you have hypertension or high Blood Pressure (BP >180) ? : "
let ques12 = "12. Do you suffer from anemia or any blood/bleeding disorders? : "
let ques13 = "13. Have you tested positive for any communicable diseases like HIV, Hepatitis, Syphilis in the past? : "
let ques14 = "14. Have you tested positive for any infectious diseases like TB, Malaria? : "
let ques15 = "15. Do suffer from any chronic illnesses or cancers? : "
let ques16 = "16. Do you currently have any symptoms of fever/cough/ cold? : "
let ques17 = "17. Was your COVID diagnosis confirmed by a laboratory test? : "
let ques18 = "18. Has it been 14 days since the last day of COVID symptoms? : "
let ques19 = "19. Date of last symptoms/ hospital discharge : "
let ques20 = "20. Do you have a hospital discharge report? : "
let ques21 = "21. Do you have an Aadhar Card? : "





exports.renderDonorEmail = async(donor)=>{


  // setting intergral values to string // 1 -> Yes , 0->No , -1->Dont know


  let fields = ["pregnant","tattoo","bp","anemia","hiv","mosquito","cancer","flu","labTestConfirm","labTestConfirm","days14over","dischargeReport","aadhaar"]

  textValOf = {}

  fields.forEach(key => {

      if(donor[key] == 1){
        textValOf[key] = "Yes"
      }else if(donor[key] == 0){
        textValOf[key] = "No"
      }else if(donor[key] == -1){
        textValOf[key] = "Dont know"
      }else if(donor[key] == null){
        textValOf[key] = "Unavailable"
      }

    });


    let list_char = "• "
    const doc = new PDFDocument();

    try {

      doc.pipe(fs.createWriteStream(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${donor._id}.pdf`));


    

    doc
      .font(__dirname+'/fonts/poppins.ttf')
      .fontSize(12)
      .text(`${list_char} ${ques1} ${donor.name}`)
      .text(`${list_char} ${ques2} ${donor.age}`)
      .text(`${list_char} ${ques3} ${donor.sex}`)
      .text(`${list_char} ${ques4} ${donor.contact}`)
      .text(`${list_char} ${ques5} ${donor.email}`)
      .text(`${list_char} ${ques6} ${donor.blood}`)
      .text(`${list_char} ${ques7} ${donor.weight}`)
      .text(`${list_char} ${ques8} ${donor.location}`)
      .moveDown()
      .text(`${list_char} ${ques9} ${textValOf.pregnant}`)
      .text(`${list_char} ${ques10} ${textValOf.tattoo}`)
      .text(`${list_char} ${ques11} ${textValOf.bp}`)
      .text(`${list_char} ${ques12} ${textValOf.anemia}`)
      .text(`${list_char} ${ques13} ${textValOf.hiv}`)
      .text(`${list_char} ${ques14} ${textValOf.mosquito}`)
      .text(`${list_char} ${ques15} ${textValOf.cancer}`)
      .text(`${list_char} ${ques16} ${textValOf.flu}`)
      .text(`${list_char} ${ques17} ${textValOf.labTestConfirm}`)
      .text(`${list_char} ${ques18} ${textValOf.days14over}`)
      .text(`${list_char} ${ques19} ${donor.last_symptom_discharge_date}`)
      .text(`${list_char} ${ques20} ${textValOf.dischargeReport}`)
      .text(`${list_char} ${ques21} ${textValOf.aadhaar}`)

       
    doc.end();
  } catch (e) {
    console.log(e);

  }

}

