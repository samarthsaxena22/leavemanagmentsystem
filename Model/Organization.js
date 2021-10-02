var mongoose = require('mongoose');
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
})
module.exports = mongoose.model('Organization', OrgSchema);