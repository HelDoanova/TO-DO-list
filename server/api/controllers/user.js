const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//POST - signup
exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })        //zajistujeme ze se nevytvori user s jiz existujici email adresou
        .exec()
        .then(user => {
            if (user.length >= 1) {                 //existuje   
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {                                                    //user.length = 0 ---> neexistuje -> vytváøím ho
                bcrypt.hash(req.body.password, 10, (err, hash) => {     //hashuju heslo aby nebylo videt v databazi
                    if (err) {                                          // + pridavam za nej random string aby nemohlo byt desifrovano
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
}

//POST - login
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })                //lock the user in
        .exec()
        .then(user => {                                 //user array
            if (user.length < 1) {                      //zadny user
                return res.status(401).json({           //1.overeni
                    message: "Authorization failed"
                });
            }                                           //user = [0], jediny user ktery se nasel
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {                                   //overeni - bud spatne heslo nebo email
                    return res.status(401).json({
                        message: "Authorization failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({    //sign(payload,secretOrPrivateKey,[options,callback])
                        email: user[0].email,   //payload= co vse chceme pustit ke kientovi
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"             //token bude platny jen 1 hodinu --kvuli zabezpeceni
                        }
                    );
                    return res.status(200).json({
                        message: "Authorization successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Authorization failed"
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

//DELETE
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(resuslt => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}