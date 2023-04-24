const express= require('express');
const Mittal=require('../model/user');
const  UserController=require('../controllers/usercon');
const auth=require('../middleware/auth');
const { changePassword } = require('../controllers/usercon');
const router=express.Router();
router.use('/changePassword',auth)
router.use('/logged',auth)
router.post('/insert', UserController.user)
router.post('/login', UserController.userLogin)
router.post('/reset',UserController.resetPasswordWithEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)
router.post('/forgotpassword/:id',UserController.forgotPassword)
router.post('/changepassword', UserController.changePassword)
router.get('/logged',UserController.logged)

module.exports=router;