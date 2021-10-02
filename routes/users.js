var express = require('express');
const User = require('../Model/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup',function(req,res,next){
    console.log(req.body)
    const _user = new User(req.body)
    _user.save(function(err){
      if (err) res.send({err:err})
    });
    res.send("done")
})

module.exports = router;