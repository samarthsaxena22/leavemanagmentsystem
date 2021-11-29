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
  res.render("signup", { user: req.cookies.user });
});
router.get("/signin", async (req, res) => {
  if (req.cookies.user) {
    const user = await User.findOne({ _id: req.cookies.user }).select("role");
    console.log(user);
    if (user === "Supervisor") res.redirect("/super/dashboard");
    else {
      res.clearCookie("user");
      res.redirect("/");
    }
  } else res.render("signin");
});

//post Request
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = User.findOne({ email: req.body.email }, async (err, data) => {
    console.log(data, err);
    if (data) {
      const validPassword = await bcrypt.compare(password, data.password);
      if (validPassword) {
        res.cookie(`user`, data._id);
        res.redirect("/super/dashboard");
      }
    } else res.send(JSON.stringify(err));
  });
  //console.log(user);
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const _user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  _user.password = await bcrypt.hash(_user.password, salt);
  _user.save(function (err, data) {
    if (err) res.send({ err: err });
    else {
      console.log(data._id);
      res.cookie(`user`, data._id);
      res.render("signup", { user: data._id });
    }
  });
});

router.get("/signout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/signin");
});
router.get("/profile", async (req, res) => {
  const user = await User.findOne({ _id: req.cookies.user });

  res.render("dashboard", { data: user, tab: "profile" });
});

router.post("/addorg", async function (req, res, next) {
  console.log(mongoose.Types.ObjectId(req.cookies.user));
  const _Organization = await new Organization({ ...req.body });

  console.log(_Organization);
  _Organization.save(async function (err, data) {
    if (err) res.send({ err: err });
    else {
      const user = req.cookies.user;
      console.log(user, typeof user, req.cookies);
      let test = await User.findOneAndUpdate(
        { _id: user },
        { organization: mongoose.Types.ObjectId(data._id) }
      );
      console.log(test);
      res.redirect("/signin");
    }
  });
});
router.post("/manager", function (req, res, next) {
  //console.log(req.body);
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
      res.send("ok");
    }
  });
});

router.get("/dashboard", async (req, res) => {
  if (req.cookies.user) {
    //console.log(req.cookies.user)
    const user = await User.findOne({ _id: req.cookies.user });
    // console.log(user);
    res.render("dashboard", { user: user, type:"Dashboard" });
  } else res.render("signin");
});

router.get("/managers",async (req,res)=>{

  const org = await User.findOne({_id:req.cookies.user}).select("organization");
  
  const data = await User.find({role:"Manager",org}).populate('department','name',Department);
  console.log(data)
  res.render("dashboard",{data:data,type:"Managers"})

})
router.get('/managers/delete/:id/:dept',async(req,res)=>{
  console.log(req.params)
  await User.deleteOne({_id:mongoose.Types.ObjectId(req.params.id)});
  await Department.deleteOne({_id:mongoose.Types.ObjectId(req.params.dept)});
  res.redirect("/super/managers")
})

module.exports = router;
