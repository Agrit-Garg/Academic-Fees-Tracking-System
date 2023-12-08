const express =require("express");
let ejs = require('ejs');
const user_route= express();
const path = require("path");

const session = require("express-session");
const config = require("../config/config");
user_route.use(session({secret:config.sessionSecret}));

const auth=require("../middleware/auth");

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser =require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
// user_route.use(express.static(path.join(__dirname,'public')));
user_route.use("/public",express.static("public"));


const userController = require("../controllers/userController");
user_route.get('/',auth.isLogout,userController.loadLogin);
user_route.get('/index',auth.isLogout,userController.loadHome);
user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.get('/login',auth.isLogout,userController.loadLogin);
user_route.get('/trackfee',auth.isLogin,userController.loadTrackfee);
user_route.get('/receipt',userController.loadRecipt);


user_route.post('/register',userController.insertUser);

user_route.get('/verify',userController.verifyMail);


user_route.get('/homelogin',auth.isLogin,userController.loadHomeLogin);

user_route.post('/login',userController.verifyLogin);

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/payfee',auth.isLogin,userController.payfee);

user_route.post('/payfee',userController.updateProfile);




module.exports = user_route;  
