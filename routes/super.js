var express = require('express');
var router = express.Router();
var User = require('../Model/User')
var Organization = require('../Model/Organization')
var Department = require('../Model/Department')
/* GET home page. */
router.post('/signup', function(req,res,next){
    console.log(req.body)
    const _user = new User(req.body)
    _user.save(function(err){
      if (err) res.send({err:err})
    });
    res.send("done")
});
router.post('/addorg',function(req,res,next){
    console.log(req.body)
    const _Organization = new Organization(req.body)
    _Organization.save(function(err){
      if (err) res.send({err:err})
      else{
        res.send("done")
      }
    });
})
router.post('/adddept',function(req,res,next){
    console.log(req.body)
    const _Department = new Department(req.body)
    _Department.save(function(err){
      if (err) res.send({err:err})
      else{
        res.send("done")
      }
    });
})
router.post('/adddept',function(req,res,next){
    console.log(req.body)
    const _Department = new Department(req.body)
    _Department.save(function(err){
      if (err) res.send({err:err})
      else{
        res.send("done")
      }
    });
})

module.exports = router;
