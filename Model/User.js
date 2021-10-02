var mongoose = require('mongoose');
const Org  = require('./Organization')
const Dept  = require('./Department')

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        require:true
    },
    role:{
        type: String,
        enum : ['Employee','Manager','Supervisor','Superadmin'],
        default: 'Employee'
    },
    organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Org,
        default:null
    },
    Department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Dept,
        default:null
    }
})

module.exports = mongoose.model('User', UserSchema);