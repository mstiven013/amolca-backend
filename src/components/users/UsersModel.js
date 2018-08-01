'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: [{
        type: String,
        required: true,
        enum: ['SUPERADMIN', 'ADMIN', 'SELLER', 'AUTHOR', 'EDITOR', 'CLIENT', 'VIDEO_EDITOR']
    }],
    password: {
        type: String,
        required: true,
        select: false
    },
    signupDate: {
        type: Date,
        default: Date.now()
    },
    lastLogin: Date,
    avatar: String,
    description: String,
    phone: Number,
    cellphone: Number,
    company: String,
    postal_code: Number,
    billing_address: String,
    shipping_address: String,
    birthday: Date,
    country: {
        type: String,
        required: true
    },
    state: String,
    store: String,
    products: Array,
    posts: Array
});

//encrypt password
UserSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err)

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return next(err)

            user.password = hash;
            next()
        });
    });
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.gravatar = function() {
    if(!this.email) return 'https://gravatar.com/avatar/?s=200&d=retro'

    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

const User = mongoose.model('User', UserSchema)

module.exports = mongoose.model('User', UserSchema);