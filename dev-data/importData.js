const fs = require("fs");

const dotenv = require('dotenv').config();
const mongoose = require("mongoose");

const tourModel = require("../models/tourModel")

const localdb = process.env.DATABASE_LOCAL;
const atlasdb = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
)

mongoose.connect(atlasdb,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(con=>{
    console.log("MongoDB connected");
}).catch(err=>{
    console.log(err);
})



// read
const tours = JSON.parse(fs.readFileSync(__dirname+"/data/tours-simple.json" , 'utf-8'));

// import
const importData = async ()=>{
    try{
        await tourModel.create(tours);
        console.log("Data successfully imported");
        
    }catch(err){
        console.log(err);
        
    }
    process.exit();

}

//Delete all collection


const deleteData = async()=>{
    try{
        await tourModel.deleteMany({})
        console.log("All Tour Data Deleted");
    }catch(err){
        console.log(err);
    }
    process.exit();

}

let action = process.argv[2];

if(action === "--delete"){
    deleteData();
}
if(action == "--import"){
    importData();
}
