var mongoose = require('mongoose');
const Department = require('./Department');
var User = require('./User')

const OrgSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    }, 
    supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }, 
    departments:{
        type:["Department"],
        
    },
    availableleaves:{
        type:["LeaveType"]
    }
})
module.exports =  mongoose.models.Organization || mongoose.model('Organization', OrgSchema);
//