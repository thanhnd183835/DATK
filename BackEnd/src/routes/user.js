const express = require('express');
const router = express.Router();
const controller = require('../controller/user');
const { requireSignIn} = require('../middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s/g, ''));
    },
});
const upload = multer({ storage });

router.get('/get-me', requireSignIn, controller.getMe);
module.exports = router;