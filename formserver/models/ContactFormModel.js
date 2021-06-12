var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notesSchema = new Schema({
    message: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

var ContactForm = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [notesSchema],
    ownername: {
        type: String,
        default: ''
    },
    leadsource: {
        type: String,
        default: ''
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    accountname: {
        type: String,
        default: ''
    },
    vendorname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    phonenumber: {
        type: String,
        default: ''
    },
    otherphone: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    homephone: {
        type: String,
        default: ''
    },
    fax: {
        type: String,
        default: ''
    },
    dateofbirth: {
        type: String,
        default: ''
    },
    assistant: {
        type: String,
        default: ''
    },
    asstphone: {
        type: String,
        default: ''
    },
    emailoptout: {
        type: String,
        default: ''
    },
    skypeid: {
        type: String,
        default: ''
    },
    secondaryemail: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    reportingto: {
        type: String,
        default: ''
    },
    mailingstreet: {
        type: String,
        default: ''
    },
    mailingcity: {
        type: String,
        default: ''
    },
    mailingstate: {
        type: String,
        default: ''
    },
    mailingzip: {
        type: String,
        default: ''
    },
    mailingcountry: {
        type: String,
        default: ''
    },
    otherstreet: {
        type: String,
        default: ''
    },
    othercity: {
        type: String,
        default: ''
    },
    otherstate: {
        type: String,
        default: ''
    },
    otherzip: {
        type: String,
        default: ''
    },
    othercountry: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
},
    {
        timestamps: true
});


module.exports = mongoose.model('ContactForm', ContactForm);