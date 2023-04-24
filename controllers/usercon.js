const express=require('express');
const Mittal=require('../model/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
class UserController{
    static user=async (req,res)=>{
        var {name,email,password,password_conferm,tc}=req.body;
        const user=await Mittal.findOne({email:email})
        if(user){
            res.send("email already exist")
        }
        else{
            if(name && email && password && password_conferm && tc){
             if(password===password_conferm){
                try{
                const salt= await bcrypt.genSalt(10)
                const hash= await bcrypt.hash(password,salt);
               const doc= new Mittal({
                name:name,
                email:email,
                password:hash,
                tc:tc
               })

               await doc.save();
               res.send({'message':'registration success'});
            }catch(err){
                //console.log('err');
                res.send('unable to register',);
            }

             }else{
                res.send("password and conferm password doesnt match")
             }
            }else{
                res.send("all feilds are required")
            }
        }
    }
    static userLogin= async (req,res)=>{
        try{
         const {email,password}=req.body;
         if(email && password){
          const user= await Mittal.findOne({email:email})
          if(user!=null){
           const isMatch = await bcrypt.compare(password,user.password)
           if((user.email===email) && isMatch){
            const token=jwt.sign({userID:user._id},'secret')

             res.send({'message':"login success",'token':token})
           }else{
            res.send("not success..")
           }
          }else{
            res.send('you are not registered')
          }
         }else{
            res.send("all feilds are required")
         }
        }catch(err){
            res.send("user not find")
        }
    }
    static changePassword= async (req,res)=>{
      const {password,password_conferm}=req.body;
      if(password && password_conferm){
        if(password!==password_conferm){
       res.send('password and conferm password does not match');
        }else{
          const salt=await bcrypt.genSalt(10);
          const hash=await bcrypt.hash(password,salt)
          await Mittal.findByIdAndUpdate(req.user._id,{$set:{password:hash}})
          res.send('password change success')
        }
      }else{
        res.send('all feilds are required')
      }
    }
    static logged=async (req,res)=>{
        res.send({"user":req.user})
    }
    static resetPasswordWithEmail= async(req,res)=>{
        const {email}=req.body
        if(email){
         const user=await Mittal.findOne({email:email})
         
         if(user){
            const secret=user._id+'secret'
            const token=jwt.sign({userID:user._id},secret,{
                expiresIn:'15m'
            })
            const link=`http://127.0.0.1:3000/reset/${user._id}/${token}`
            console.log(link)
            res.send('email sent')
         }else{
            res.send('email does not exist')
         }
        }else{
            res.send('email is required')
        }


    }

    static userPasswordReset = async (req,res)=>{
      const {password,password_conferm}=req.body;
      const {id,token}=req.params;
      const user=await Mittal.findById(id);
      const new_secret=user._id +'secret' ;
      try{
  jwt.verify(token,new_secret)
  if(password && password_conferm){
    if(password !== password_conferm){
      res.send({"status":"failed","message":"password and conferm password doesnt match"})
    }else{
      const salt=await bcrypt.genSalt(10);
      const hash=await bcrypt.hash(password,salt)
        await Mittal.findByIdAndUpdate(user._id,{$set:{password:hash}})
      res.send('password reset success')
    }

  }else{
    res.send({"status":"failed","message":"all field required"})
  }
      }catch(erroe){
        res.send({"status":"failed","message":"invalid token"})

      }

    }


     static forgotPassword= async(req,res)=>{
        const {password,password_conferm}=req.body
        const {id}=req.params
        const user= await Mittal.findOne({id})
       console.log(user);
            if(password && password_conferm){
               if(password!==password_conferm){
             res.send('password and conferm password not match')
               }else{
                const salt=await bcrypt.genSalt(10);
          const hash=await bcrypt.hash(password,salt)
          await Mittal.findByIdAndUpdate(user._id,{$set:{password:hash}})
          res.send('password reset success')
               }
            }else{
                res.send('all feilds are required')
            }
       

     }
}
module.exports= UserController;