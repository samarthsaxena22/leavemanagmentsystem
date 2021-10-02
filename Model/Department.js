var mongoose = require('mongoose');

var Organization = require('./Organization')

const DepartSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:Organization,
        default:null
    }
})
module.exports = mongoose.model('Department', DepartSchema);