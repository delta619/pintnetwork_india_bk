const PDFDocument = require('pdfkit');
const constants = require('../../constants');
const fs = require('fs');
const path = require('path');

fillDetails = function(donor){


  let fields = ["pregnant","diabities","onMedication","tattoo","bp","anemia","hiv","mosquito","hadFollowUp","cancer","flu","labTestConfirm","days14over","dischargeReport","aadhaar"]

  fields.forEach(field => {
    if(donor[field] == 1){
      donor[field] = "Yes";
    }else if (donor[field] == 0){
      donor[field] = "No";
    }else if(donor[field] == -1){
      donor[field] = "I Dont Know";
    }else if(donor[field] == null){
      donor[field] = "Unavailable";
    }
  });

  let dt = new Date(donor.last_symptom_discharge_date);

  dt = dt.toDateString().split(' ');
  day = dt[2];
  month = dt[1];
  year = dt[3];

  donor.last_symptom_discharge_date = `${day}-${month}-${year}`;

  

          let val =[
            [`Name : ${donor.name}`],
            [`Age : ${donor.age}`],
            [`Gender : ${donor.sex}`],
            [`Contact No. : ${donor.contact}`],
            [`Email : ${donor.email}`],
            [`Blood : ${donor.blood}`],
            [`Weight :${donor.weight}`],
            [`Location : ${donor.location}`],
            [`Have you ever been pregnant? : ${donor.pregnant}`],
            [`Have you obtained a tattoo or piercing in the last 12 months? : ${donor.tattoo}`],
            [`Do you have hypertension or high Blood Pressure (BP >180)? : ${donor.bp}`],
            [`Do you have diabetes? : ${donor.diabities}`],
            [`Are you taking any medications? : ${donor.onMedication}`],
            [`Do you suffer from anemia or any blood/bleeding disorders? : ${donor.anemia}`],
            [`Have you tested positive for any communicable diseases like HIV, Hepatitis, Syphilis in the past? : ${donor.hiv}`],
            [`Do you suffer from an active case from any infectious diseases like Tuberculosis(TB), Malaria? : ${donor.mosquito}`],
            [`Do suffer from any chronic illnesses or cancers? : ${donor.cancer}`],
            [`Do you currently have any symptoms of fever/cough/ cold? : ${donor.flu}`],
            [`Was your COVID diagnosis confirmed by a laboratory test? : ${donor.labTestConfirm}`],
            [`Has it been 14 days since the last day of COVID symptoms? : ${donor.days14over}`],
            [`Date of last symptoms : ${donor.last_symptom_discharge_date}`],
            [`Have you had a follow up test that was negative for COVID-19? : ${donor.hadFollowUp}`],
            [`Do you have a hospital discharge report? : ${donor.dischargeReport}`],
            [`Do you have an Aadhar Card? : ${donor.aadhaar}`],
        ]

        return val;
}






exports.renderDonorEmail = async(donor)=>{

  lines=fillDetails(donor);

  // setting intergral values to string // 1 -> Yes , 0->No , -1->Dont know


  const doc = new PDFDocument();

    try {

      doc.pipe(fs.createWriteStream(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${donor._id}.pdf`));


    

    doc
      .font(__dirname+'/fonts/poppins.ttf')
      .fontSize(12)
   
      for (let i = 0; i < 8; i++) {
        doc.text(`${i+1}. ${lines[i]}`);
      }


      doc.moveDown();
      
      for (let i = 8; i < lines.length; i++) {
        
        doc.text(`${i+1}. ${lines[i]}`);
        
      }
      

       
    doc.end();
  } catch (e) {
    console.log(e);

  }

}

