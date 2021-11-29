var express = require('express');
const Organization = require('../Model/Organization');
const User = require('../Model/User');
var router = express.Router();

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
    res.render("user/dashboard",{data:user,type:"Dashboard"})
  }
  else
  res.redirect('/signin')
})
router.get("/leaves",async (req,res)=>{
  if(req.cookies.user){
    console.log(req.cookies.user)
    const user = await User.findOne({_id:req.cookies.user});
    
    res.render("user/dashboard",{data:user,type:"Leaves"})
  }
  else
  res.redirect('/signin')
})
router.get("/signin",async (req,res)=>{
  if(req.cookies.user){
    const user = await User.findOne({_id:req.cookies.user})
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
  

module.exports = router;