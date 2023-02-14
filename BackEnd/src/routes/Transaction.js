const express = require('express');
const router = express.Router();
const {requireSignIn} = require('../middleware');
const cors = require('cors')
const controller = require('../controller/Transaction')
router.post('/create_payment_url', requireSignIn, controller.create_payment_url);
router.get('/return_payment_url', requireSignIn, controller.vnpay_return);
router.get('/vnpay_ipn', requireSignIn, controller.vnpay_ipn);
router.get('/getAllTransaction', requireSignIn, controller.getListTransaction);
router.get('/search', requireSignIn, controller.searchTransaction);
router.get('/paymentResults', requireSignIn, controller.vnpay_return);
module.exports = router;