const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const {Server} = require("./app");

console.log(`#${process.env.NODE_ENV}# mode is on`);

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




//test


Server.listen(process.env.PORT || 3000 , (err)=>{
    if(err)console.log(err)
    else{
        console.log(`Server started at port ${process.env.PORT || 3000}`);   
    }    
})