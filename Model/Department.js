var mongoose = require('mongoose');
const LeaveType = require('./LeaveType');
const User = require('./User');

const DepartSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    desc:{
    type:String,
        required:true
    },
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    
})
module.exports = mongoose.models.Department || mongoose.model('Department', DepartSchema);