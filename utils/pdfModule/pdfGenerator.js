const PDFDocument = require('pdfkit');
const fs = require('fs');

let ques1 = "Name : "
let ques2 = "Age : "
let ques3 = "Gender : "
let ques4 = "Contact No. : "
let ques5 = "Email : "
let ques6 = "Blood Group : "
let ques7 = "Weight :"
let ques8 = "City : "
// let ques9 = "Location : "
let ques10 = "Are you pregnant ? : "
let ques11 = "Have you obtained a tattoo or piercing in the last 12 months? : "
let ques12 = "Do you have hypertension or high Blood Pressure (BP >180) ? : "
let ques13 = "Do you suffer from anemia or any blood/bleeding disorders? : "
let ques14 = "Have you tested positive for any communicable diseases like HIV, Hepatitis, Syphilis in the past? : "
let ques15 = "Have you tested positive for any infectious diseases like TB, Malaria? : "
let ques16 = "Do suffer from any chronic illnesses or cancers? : "
let ques17 = "Do you currently have any symptoms of fever/cough/ cold? : "
let ques18 = "Was your COVID diagnosis confirmed by a laboratory test? : "
let ques19 = "Has it been 14 days since the last day of COVID symptoms? : "
let ques20 = "Date of last symptoms/ hospital discharge : "
let ques21 = "Do you have a hospital discharge report? : "
let ques22 = "Do you have an Aadhar Card? : "





exports.renderDonorEmail = async(donor)=>{

    console.log("insode pdf creation");


    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(+__dirname+'/../userdata/sandbox_emails/file.pdf'));
    
    doc
      .font(__dirname+'/fonts/roboto.ttf')
      .fontSize(10)
      .text(`Ques. ${ques1} ${donor.name}`)
      .text(`Ques. ${ques2} ${donor.age}`)
      .text(`Ques. ${ques3} ${donor.gender}`)
      .text(`Ques. ${ques4} ${donor.contact}`)
      .text(`Ques. ${ques5} ${donor.email}`)
      .text(`Ques. ${ques6} ${donor.blood}`)
      .text(`Ques. ${ques7} ${donor.weight}`)
      .text(`Ques. ${ques8} ${donor.city}`)
    //   .text(`Ques. ${ques9}`)
    //   .text(`Ans. ${}`)
      .text(`Ques. ${ques10}`)
      
      .text(`Ques. ${ques11}`)
      .text(`Ques. ${ques12}`)
      .text(`Ques. ${ques13}`)
      .text(`Ques. ${ques14}`)
      .text(`Ques. ${ques15}`)
      .text(`Ques. ${ques16}`)
      .text(`Ques. ${ques17}`)
      .text(`Ques. ${ques18}`)
      .text(`Ques. ${ques19}`)
      .text(`Ques. ${ques20}`)
      .text(`Ques. ${ques21}`)
       
    doc.end();


}

