var express = require('express');
const Organization = require('../Model/Organization');
const User = require('../Model/User');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const Leave = require('../Model/Leave');
/* GET users listing. */


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/dashboard",async (req,res)=>{
  console.log(req.session.userRole)
  if(req.session.isAuth && req.session.userRole === 'Employee' ){
    //console.log(req.cookies.user)
    const user = await User.findOne({_id:req.session.userId});
    //console.log(user);
    
    res.render("user/dashboard",{data:user,type:"Dashboard"})
  }
  else
  res.redirect('/signin')
})
router.get("/leaves",async (req,res)=>{
  if(req.session.isAuth){
    console.log(req.cookies.user)
    const user = await User.findOne({_id:req.session.userId});
  
    const leave = await Organization.findOne({_id:mongoose.Types.ObjectId(user.organization)}).populate('availableleaves')
    
  
    res.render("user/dashboard",{data:user,leavetype:leave.availableleaves,type:"Leaves"})
  }
  else
  res.redirect('/signin')
})
router.get("/signin",async (req,res)=>{
  if(req.cookies.user){
    const user = await User.findOne({_id:req.session.userId})
    res.redirect("/user/dashboard")
  }
  else
  res.render('user/signin')
})

//post Request
router.post("/signin", async (req,res)=>{
  
  const {email,password} = req.body
  console.log(req.body)
    const user = User.findOne({email:req.body.email} , async (err,data) => {
      console.log(data,err);
      if(data){
        const validPassword = await bcrypt.compare(password, data.password);
        if(validPassword && data.role==='Employee'){
          res.render('user/dashboard',{data:data,type:"Dashboard"})
        }
      }
      else res.send(JSON.stringify(err))

    })
    //console.log(user);
})
  
router.post('/leave/request',async (req,res)=>{
  console.log(req.body);
  const user = User.findOne({_id:req.session.userId});
  const _leave = new Leave({...req.body,user_id:req.session.userId,organization:user.organization,department:user.department})
  _leave.save((err,data)=>{
    if(err) res.send({err:err});
    else
      res.redirect('/user/leaves')

  })
})

module.exports = router;