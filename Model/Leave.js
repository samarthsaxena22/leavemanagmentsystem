var mongoose = require('mongoose');
const Org  = require('./Organization')
const Dept  = require('./Department');
const User = require('./User');
const LeaveType = require('./LeaveType');

const LeaveSchema = new mongoose.Schema({
   user_id:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
   },
   changedby:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
   },
   status:{
    type: String,
    enum : ['Pending','Approved','Rejected'],
    default: 'Employee'
   },
   date:{
       type:Date
   },
   leavetype:{
       type: mongoose.Schema.Types.ObjectId,
       ref:"LeaveType"
   }
})


module.exports = mongoose.model('Leave', LeaveSchema);