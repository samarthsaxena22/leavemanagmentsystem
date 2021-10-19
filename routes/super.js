var express = require("express");
var router = express.Router();
var User = require("../Model/User");
var Organization = require("../Model/Organization");
var Department = require("../Model/Department");
var bcrypt = require("bcrypt");


/* GET home page. */

//get Request
router.get("/signup", function (req, res, next) {
   
  res.render("signup",{user:req.cookies.user});
});
router.get("/signin",async (req,res)=>{
  if(req.cookies.user){
    const user = await User.findOne({_id:req.cookies.user})
    res.redirect("/super/dashboard")
  }
  else
  res.render('signin')
})

//post Request
router.post("/signin", async (req,res)=>{
  
  const {email,password} = req.body
  
    const user = User.findOne({email:email}).exec(async (err,data)=>{
      console.log(data,err);
      if(data){
        const validPassword = await bcrypt.compare(password, data.password);
        if(validPassword){
          
          res.render('dashboard',{user:data})
        }
      }
      else res.send(JSON.stringify(err))

    })
    //console.log(user);
    
  }
)

router.post("/signup", async (req, res) => {
  console.log(req.body)
  const _user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  _user.password = await bcrypt.hash(_user.password, salt);
  _user.save(function (err,data) {
    if (err) res.send({ err: err });
    else{
      console.log(data._id)
      res.cookie(`user`,data._id)
      res.render("signup",{user:data._id});
    }
  });
});

router.post("/addorg", function (req, res, next) {
  const _Organization = new Organization({...req.body,supervisor:req.cookies.user});
  _Organization.save(function (err, data) {
    if (err) res.send({ err: err });
    else {
      const user=req.cookies.user;
      console.log(user)
      User.findOneAndUpdate({_id:user},{organization:data._id});
      res.render("signin");
    }
  }); 
});
router.post("/adddept", function (req, res, next) {
  console.log(req.body);
  const _Department = new Department(req.body);
  _Department.save(function (err) {
    if (err) res.send({ err: err });
    else {
      res.send("done");
    }
  });
});


router.get("/dashboard",async (req,res)=>{
  if(req.cookies.user){
    const user = await User.findOne({_id:req.cookies.user}).populate("organization").populate("department");
    res.render("dashboard",{user:user})
  }
  else
  res.render('signin')
})

module.exports = router;
