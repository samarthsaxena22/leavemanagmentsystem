var mongoose = require('mongoose');
require('./Organization')
require('./Department')

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
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum : ['Employee','Manager','Supervisor','Superadmin'],
        default: 'Employee'
    },
    organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        default:null
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null
    },
    leaves:{  
        type:["Leave"],
    },
    isValid:{
        type:Boolean,
        default:true,
    }
})



module.exports = mongoose.model('User', UserSchema);