const mongoose=require('mongoose');
const user=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    tc:{
        type:Boolean,
        required:true
    }
})
const Mittal=new mongoose.model("mittal",user);
module.exports=Mittal;