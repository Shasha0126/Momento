const mongoose=require('mongoose');
require('dotenv').config();
const db=async()=>{
    try {
       mongoose.set('strictQuery',false) 
       await mongoose.connect(process.env.MONGO_URL)
       console.log('db connected')
    } catch (error) {
        console.log('DB connection error');
        console.log(error);
    }

    
};
module.exports=db;