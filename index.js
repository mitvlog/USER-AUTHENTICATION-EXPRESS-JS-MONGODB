const express=require('express');
var bodyParser = require('body-parser')
const app=express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
// parse application/json
app.use(bodyParser.json())
const connectDb=require('./config/connectdb');
const Mittal=require('./model/user')
const checkUserauth=require('./middleware/auth')
const  UserController=require('./controllers/usercon');
const router=require('./routes/useroutes');
app.use('',router);

const cors=require('cors');


app.use(cors());

app.listen(8000,()=>{
    console.log('listening..');
})