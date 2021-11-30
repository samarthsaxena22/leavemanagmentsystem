var express = require('express');
const Organization = require('../Model/Organization');
const User = require('../Model/User');
var router = express.Router();
var bcrypt = require('bcrypt');
const Department = require('../Model/Department');
const Leave = require('../Model/Leave');
var mongoose = require("mongoose");
/* GET users listing. */
function getleaves(org){

}
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/dashboard",async (req,res)=>{
  if(req.cookies.user){
    console.log(req.cookies.user)
    const user = await User.findOne({_id:req.cookies.user});
    console.log(user);
    res.render("./manager/dashboard",{data:user,type:"Dashboard"})
  }
  else
  res.redirect('/signin')
})
router.get("/employee",async (req,res)=>{

  const org = await User.findOne({_id:req.session.userId}).select("organization department");
  
  const data = await User.find({role:"Employee",organization:org.organization,department: org.department}).populate('department','name',Department);
  //console.log(data)
  res.render("./manager/dashboard",{data:data,type:"Employee"})

})

router.post("/employee", async function (req, res, next) {
  //console.log(req.body);
  const user = await User.findOne({_id:req.session.userId});
  const _user = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phno,
    password: "test",
    role: "Employee",
    department:user.department,
    organization:user.organization,
    
  });
  const salt = await bcrypt.genSalt(10);
  _user.password = await bcrypt.hash(_user.password, salt);
      
      await _user.save((err, data) => {
        if (err) res.send({ err: err });
        res.redirect("/manager/employee")
      });
  
  
});





router.get("/leaves",async (req,res)=>{
  if(req.cookies.user){
    const user = await User.findOne({_id:req.session.userId});
    const leaves = await Leave.find({organization:user.organization,department:user.department}).populate('user_id','name',User)
    console.log(user)
    
    res.render("./manager/dashboard",{data:leaves,type:"Leaves"})
  }
  else
  res.redirect('/signin')
})

  
router.post('/leave/request',async (req,res)=>{
  console.log(req.body);
})
router.get('/leave/approve/:id',async(req,res)=>{
  console.log(req.params)
  await Leave.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{status:"Approved"}) 
  res.redirect("/manager/leaves")
})
router.get('/leave/reject/:id',async(req,res)=>{
  console.log(req.params)
  await Leave.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{status:"Rejected"}) 
  res.redirect("/manager/leaves")
})

module.exports = router;