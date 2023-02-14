const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//login
module.exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        } else if (user.status === 2) {
            return res.status(403).json({
                error: 'Account is block',
            });
        } else {
            const hash_password = user.password;
            const right_pass = await bcrypt.compare(password, hash_password);
            if (!right_pass) {
                return res.status(404).json({
                    error: 'Password incorrect',
                });
            } else {
                const token = jwt.sign(
                    { _id: user._id, role: user.role, transactions: user.transactions},
                    "MERNSECRET",
                    {
                        expiresIn: '300d',
                    },
                );
                res.cookie('token', token);
                const { _id, email, role, fullName, avatar, userName,status,transactions } = user;
                await User.findOneAndUpdate({ email: email }, { active: true });
                return res.status(200).json({
                    code: 0,
                    data: {
                        _id,
                        fullName,
                        avatar,
                        userName,
                        email,
                        role,
                        status,
                        transactions,
                    },
                    token,
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            error: 'server error',
        });
    }
};
//register account
module.exports.signUp = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({
            $or: [{email: email}]
        });
        // check user and password is existed
        if (user)
            return res.status(400).json({
                code: 1,
                message: 'email or username is exists'
            });
        else {
            const hash_password = await bcrypt.hash(password, 10);
            const _user = new User({
                email: email,
                password: hash_password,
            });
            _user.save((err, data) => {
                if (err) {
                    return res.status(404).json({
                        code: 1,
                        error: 'bad request'
                    });
                }
                if (data) {
                    return res.status(200).json({
                        code: 0,
                        data: data,
                    });
                }
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: 1,
            error: 'Server error'
        })
    }
};
// replace password
module.exports.replacePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        } else {
            const hash_password = user.password;
            const right_pass = await bcrypt.compare(password, hash_password);
            if (!right_pass) {
                return res.status(404).json({
                    error: 'Password incorrect',
                });
            } else {
                const decodePass = await bcrypt.hash(newPassword, 10);
                await User.findOneAndUpdate({ _id: req.user._id }, { password: decodePass });
                return res.status(200).json({
                    code: 0,
                    message: 'Password changed',
                });
            }
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            error: 'Server error',
        });
    }
};