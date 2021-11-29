var express = require("express");
var router = express.Router();
var Organization = require("../Model/Organization");
var Department = require("../Model/Department");
var User = require("../Model/User");

var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const LeaveType = require("../Model/LeaveType");


/* GET home page. */

//get Request
router.get("/signup", function (req, res, next) {
  res.render("./super/signup", { user: req.session.userId });
});

router.post("/signup", async (req, res) => {
  const _user = new User({...req.body,role:"Supervisor"});
  const salt = await bcrypt.genSalt(10);
  _user.password = await bcrypt.hash(_user.password, salt);
  _user.save(function (err, data) {
    if (err) res.send({ err: err });
    else {
      req.session.userId = data._id
      res.render("./super/signup", { user: data._id });
    }
  });
});

router.get("/profile", async (req, res) => {
  const user = await User.findOne({ _id: req.session.userId });

  res.render("./super/dashboard", { data: user, tab: "profile" });
});

router.post("/addorg", async function (req, res, next) {

  const _Organization = await new Organization({ ...req.body });

  console.log(_Organization);
  _Organization.save(async function (err, data) {
    if (err) res.send({ err: err });
    else {
            
      let test = await User.findOneAndUpdate(
        { _id: req.session.userId },
        { organization:data._id }
      );
      
      res.redirect("/signin");
    }
  });
});
router.post("/manager", async function (req, res, next) {
  //console.log(req.body);
  const org = await User.findOne({_id:req.session.userId});
  const _dept = new Department({
    name: req.body.deptname,
    desc: req.body.deptdesc,
  });
  _dept.save(async (err, data) => {
    if (err) res.send({ err: err });
    else {
      const _user = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phno,
        password: "test",
        role: "Manager",
        department: mongoose.Types.ObjectId(data._id),
        organization:org.organization
      });
      
     
      
      const salt = await bcrypt.genSalt(10);
      _user.password = await bcrypt.hash(_user.password, salt);
      console.log(await User.findOne({ _id: req.cookies.user }).select("_id"));
      await _user.save((err, data) => {
        if (err) res.send({ err: err });
        res.redirect("/super/managers")
      });
    }
  });
});

router.post("/leavetype", async (req, res) => {
  req.body.count = parseInt(req.body.count);
  const { name, desc, count } = req.body;

  const _leavetype = new LeaveType({ name, desc, count });
  console.log("leave", _leavetype);
  _leavetype.save(async (err, data) => {
    if (err) res.send({ err: err });
    else {
      const org = await User.findById(
        mongoose.Types.ObjectId(req.cookies.user)
      ).select("organization");
      await Organization.findOneAndUpdate(
        { _id: org.organization },
        { $push:{availabelleaves: data} }
      );
      console.log(org);
      res.redirect('/super/dashboard');
    }
  });
});

router.get("/dashboard", async (req, res) => {
  if (req.session.isAuth && req.session.userRole==="Supervisor") {
    const user = await User.findOne({ _id: req.session.userId });
    res.status(200)
    res.render("./super/dashboard", { user: user, type:"Dashboard" });
    
  } else res.render("signin");
});

router.get("/managers",async (req,res)=>{

  const org = await User.findOne({_id:req.session.userId}).select("organization");
  console.log(org)
  const data = await User.find({role:"Manager",organization:org.organization}).populate('department','name',Department);
  //console.log(data)
  res.render("./super/dashboard",{data:data,type:"Managers"})

})
router.get('/managers/delete/:id/:dept',async(req,res)=>{
  console.log(req.params)
  await User.deleteOne({_id:mongoose.Types.ObjectId(req.params.id)});
  await Department.deleteOne({_id:mongoose.Types.ObjectId(req.params.dept)});
  res.redirect("/super/managers")
})

module.exports = router;
