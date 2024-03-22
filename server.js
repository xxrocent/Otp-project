const express = require("express")
const mongoose = require("mongoose")
const User = require("./model/User")
const nodemailer = require("nodemailer"); // jise
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"kartikrastogi1653@gmail.com",
        pass:process.env.PASS,
    }
})

mongoose.connect("mongodb://localhost:27017/RegisterOtp").then(()=>{
    console.log("Connection to db succesfull");
}).catch(err=>{
    console.log(err);
})


const app = express();
app.set('view engine','hbs');
app.set('views','views')

app.use(express.urlencoded());
app.listen(4000,()=>{
    console.log("http://localhost:4000");
})


app.get('/',(req,res)=>{
    res.send("Welcome to my Website :)");
})

app.get('/register',(req,res)=>{
    res.render("register");
})
var email;
var Otp;
app.post('/register',async (req,res)=>{
    const data = req.body;
    const newUser = new User(data);
    
    try{
        await newUser.save();
        email=newUser.email
        Otp=random();
        mail1()
        res.render("otp");
    }catch{
        res.send("Error");
    }
})

app.post('/verify',async (req,res)=>{
    const otp = req.body;
    const user = await User.findOne().where('email').equals(email);
    if(otp.otp==Otp)
    {

        user.verified=true;
        await user.save();
        res.send("Success");
    }
    else   
        res.send("Failed");
})



function random() {
    var randomNumber = Math.floor(Math.random() * 9000) + 1000;
    console.log(randomNumber);
    return randomNumber;
}



function mail1(){
    const mail = {
        from:"kartikrastogi1653@gmail.com",
        to:email,
        subject:'OTP Verification',
        text:`Your Otp is ${Otp}`,
    }
    transporter.sendMail(mail);
}
