const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Register Form
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password doesnt match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters long' });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user=>{
                    req.flash('success_msg', 'Registered succesfully');
                })
            })
        });
        res.send('ok')

    }
});

module.exports = router;