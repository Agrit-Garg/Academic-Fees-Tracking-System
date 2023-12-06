const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

const randomstring = require("randomstring");
const config = require("../config/config");


// Convert password into Hash
const  securePassword = async(password) =>{

    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}



const loadHome = async (req, res) => {
    try {
        res.render('home');
    }
    catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req, res) => {
    try {
        res.render('login');
    }
    catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async (req, res) => {
    try {
        res.render('registeration');
    }
    catch (error) {
        console.log(error.message);
    }
}




//REGISTRAION PROCESS
const insertUser = async (req, res) => {

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        var fee;
        console.log(password);
        const year = req.body.year;
        if(year==1)
        {
            fee = 160000;
        }
        else if(year==2)
        {
            fee = 140000;
        }
        else if(year==3)
        {
            fee = 110000;

        }
        else if(year==4)
        {
            fee = 100000;

        }

        if (password === cpassword) {
            const spassword = await securePassword(password);

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                admno:req.body.admno,
                year:req.body.year,
                password: spassword,
                totalfees: fee,
                feesdue: fee,
                is_admin: 0,
            });
            console.log(user);
            const userData = await user.save();
            if (userData) {
                res.render('registeration', { regsucmessage: "Your are registered Successfully." });
                // res.send("Successfully Register");
            }
            else {
                res.render('registeration', { message: "Failed to Register" });
                // res.send("Registeration Failed");

            }
        }

        else {
            res.render('registeration', { message: "Password not match" });
        }
    }
    catch (error) {
        console.log(error.message);
        var valerror = error.message.slice(24,);
        console.log(valerror)
        res.render('registeration', { message: valerror });
    }
}

const loadHomeLogin = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('homelogin', { user: userData });//we get data of the persion whose session is created
    } catch (error) {
        console.log(error.message);
    }
}


// for verification
const verifyLogin = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;
        
        
        const userData = await User.findOne({ email: email });
        
        
        if (userData) {
            const isMatch = await bcrypt.compare(password,userData.password);//this (await) is really important because we cannot bcrypt from body.req.password

            if (isMatch) {
                req.session.user_id = userData._id;
                res.redirect('/homelogin');
            }
            else {
                res.render('login', { message: "Password is incorrect" });
            }

        }
        else {
            res.render('login', { message: "Email and password is incorrect" })
        }
    } catch (error) {
        console.log(error.message);

    }
}

//logout
const userLogout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/index');
    } catch (error) {
        console.log(error.message);
    }
}

//user pay fee

const payfee = async (req, res) => {

    try {

        //when we get data from url,we use query
        const id = req.query.id;//homelogin page nav link
        const userData = await User.findById({ _id: id });

        if (userData) {
            res.render('payfee', { user: userData });
        }
        else {
            res.redirect('/homelogin');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadTrackfee = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('trackfee', { user: userData });
        }
        else {
            res.redirect('/homelogin');
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const loadRecipt = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('receipt', { user: userData });
        }
        else {
            res.redirect('/trackfee');
        }
    }
    catch (error) {
        console.log(error.message);
    }
}


// when payment is done then 
const updateProfile = async (req, res) => {

    try {
        const feepaid = req.body.paid;
        const userdata = await User.findById(req.body.user_id);

        if (userdata) {
            const payment = {
                amount: feepaid,
                timestamp: new Date()
            };
            if (feepaid <= userdata.feesdue) { 
                var userData = await User.findByIdAndUpdate(req.body.user_id, { $push: { paid: payment }, $inc: { feesdue: -feepaid, totalpaid: feepaid } }, { new: true });

            }
            else{
                var userData = await User.findByIdAndUpdate(req.body.user_id, { $push: { paid: payment}, $inc: { totalpaid: feepaid },$set:{feesdue:0 } }, { new: true });

            }
            // const userData = await User.findByIdAndUpdate(req.body.user_id, { $push: { paid: payment }, $inc: { feesdue: -feepaid, totalpaid: feepaid } }, { new: true });
            if(userData.feesdue==0)
            {
                var stat = 3;
            }
            else if(userData.feesdue!=0 && userData.feesdue<userData.totalfees)
            {
                var stat = 2;
            }
            else if(userData.feesdue==userData.totalfees)
            {
                var stat = 1;
            }
            const updateInf = await User.updateOne({_id:req.body.user_id},{$set:{status:stat}});
            res.render('success', { user: userData});
        }
        else {
            console.log("Fee Not Paid")
        }
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loadHome,
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    payfee,
    userLogout,
    updateProfile,
    loadHomeLogin,
    loadTrackfee,
    loadRecipt
}