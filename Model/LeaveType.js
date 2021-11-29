var mongoose = require('mongoose');
const Department = require('./Department');
var User = require('./User')

const LeaveTypeSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    }, 
    count:{
        type:Number
    }
})
module.exports = mongoose.model('LeaveType', LeaveTypeSchema);