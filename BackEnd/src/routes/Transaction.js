const express = require('express');
const router = express.Router();
const {requireSignIn} = require('../middleware');
const cors = require('cors')
const controller = require('../controller/Transaction')
router.post('/create_payment_url', requireSignIn, controller.create_payment_url);
router.get('/vnpay_return', requireSignIn, controller.vnpay_return);
router.get('/vnpay_ipn', requireSignIn, controller.vnpay_ipn);
router.get('/getAllTransaction', requireSignIn, controller.getListTransaction);
router.get('/search', requireSignIn, controller.searchTransaction);
router.post('/delete-transaction/:id',requireSignIn, controller.deleteTransaction);
router.get('/info-transaction/:id', requireSignIn, controller.getOneTransactionId);
module.exports = router;