var express = require('express');
var router = express.Router();
var User = require('../Model/User')
var bcrypt = require('bcrypt')  
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("haha")
  res.render('index', { title: 'Leave managment System' });
});
router.get('/signin',async(req,res)=>{
  console.log(req.session.userRole)
  if(req.session.isAuth){
    const role = req.session.userRole
    console.log(req.session)
    if(role==='Supervisor')
    res.redirect('/super/dashboard')
    else if(role === "Manager")
    res.redirect('/manager/dashboard')
    else if(role==="Employee")
    res.redirect('/user/dashboard')
    else
      res.render('signin')

  }
  else
  res.render('signin');
})
router.post('/signin',async (req,res)=>{
  const { email, password } = req.body;
  
  const user = User.findOne({ email: req.body.email }, async (err, data) => {
   
    if (data) {
      const validPassword = await bcrypt.compare(password, data.password);
      if (validPassword) {
        res.cookie(`user`, data._id);
         req.session.isAuth = true;
         req.session.userId = data._id;
         req.session.userRole = data.role;
         console.log(data.role)
        res.redirect("/signin");
      }
    } else res.send(JSON.stringify(err));
  });
})

router.get('/signout',(req,res)=>{
  req.session.isAuth=false;
  req.session.userId = "";
  req.session.userRole = ""
  res.redirect('/signin')
})
module.exports = router;
