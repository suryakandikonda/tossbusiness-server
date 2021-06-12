var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const ContactFormModel = require('./ContactFormModel');
const ContactForm = require('./ContactFormModel');

var User = new Schema({
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    organizationName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
        unique: true
    },
    phonenumber: {
        type: String,
        default: ''
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);