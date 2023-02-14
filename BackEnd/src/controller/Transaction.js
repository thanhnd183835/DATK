const Transaction = require("../models/Transaction");
const config = require("../config/default.json");
const dateFormat = require("dateformat");
const User = require('../models/user.js');

module.exports.create_payment_url = async (req, res, next) => {
    try {
        // lay ip
        let ipAddr =
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        // lay bien trong file default.json
        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let returnUrl = config.vnp_ReturnUrl;
        // lay cac truong tu frontend gui len
        const date = new Date();
        const formatCreateDate = dateFormat(date, "isoDateTime");
        const createDate = formatCreateDate.slice(0, 19).replace(/[-T:]/g, '');
        const orderId = dateFormat(date, "HHmmss");
        const amount = req.body.amount;
        const bankCode = req.body.bankCode;
        const orderInfo = req.body.orderDescription;
        const orderType = req.body.orderType;
        let locale = req.body.language;
        const transaction = new Transaction({
            id: req._id,
            orderId: orderId,
            amount: req.body.amount,
            bankCode: req.body.bankCode,
            orderInfo: req.body.orderDescription,
            orderType: req.body.orderType,
            transactionBy: req.user._id,
        });
        transaction.save(async (error, transaction) => {
            if (error) {
                return res.status(400).json({error: "loi khi tao giao dich"});
            }
            if (transaction) {
                await User.findOneAndUpdate({_id: req.user._id}, {$push: {transactions: {transactionId: transaction._id}}})
            }
            return res.status(201).json({
                code: 0,
                data: transaction,
            })
        });


        if (locale === null || locale === "") {
            locale = "vn";
        }
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode; // ma TmnCode do vnpay cap
        vnp_Params["vnp_Locale"] = locale; // ngon ngu
        vnp_Params["vnp_CurrCode"] = currCode; // don vi tien te
        vnp_Params["vnp_TxnRef"] = orderId; // ma tham chieu giao dich
        vnp_Params["vnp_OrderInfo"] = orderInfo; // thong tin mo ta noi dung thanh toan
        vnp_Params["vnp_OrderType"] = orderType; // ma danh muc hang hoa
        vnp_Params["vnp_Amount"] = amount * 100; // so tien
        vnp_Params["vnp_ReturnUrl"] = returnUrl; // url return
        vnp_Params["vnp_IpAddr"] = ipAddr; // dia chi ip
        vnp_Params["vnp_CreateDate"] = createDate; // ngay tao giao dich
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode; // ma ngan hang
        }

        vnp_Params = sortObject(vnp_Params);
        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, {encode: false});
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, {encode: false});
        return res.status(200).json({
            data: vnpUrl,
        });

    } catch (err) {
        return res.status(500).json({code: 1, error: 'error server'})
    }
};

module.exports.vnpay_ipn = async function (req, res) {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        let config = require('config');
        const secretKey = config.get('vnp_HashSecret');
        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, {encode: false});
        const crypto = require("crypto");
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            const tsCode = vnp_Params['vnp_TransactionStatus'];
            const amount = vnp_Params['vnp_Amount'];

            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            const currentTransaction = await Transaction.findOne();
            if (currentTransaction.orderId === orderId) {
                if (currentTransaction.amount === amount) {
                    if (currentTransaction.status === '0') {
                        if (rspCode === '00' && tsCode === '00') {
                            const upDateStatus = await Transaction.findOneAndUpdate({
                                orderId: orderId,
                            }, {$set: {status: 1}});
                            if (upDateStatus) {
                                res.status(200).json({RspCode: '00', Message: 'success'})
                            }
                        } else {
                            res.status(400).json({error: "loi cap nhat status"})
                        }
                    } else {
                        res.status(200).json({RspCode: '02', Message: 'Order already confirmed'})
                    }
                } else {
                    res.status(200).json({RspCode: '04', Message: 'invalid amount'})
                }
            } else {
                res.status(200).json({RspCode: '01', Message: 'Order not found'})
            }

        } else {
            res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
        }
    } catch (RspCode) {
        res.status(200).json({RspCode: '99', Message: 'Unknow error'})
    }
}

module.exports.vnpay_return = async function (req, res) {

    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let config = require("config");
    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, {encode: false});
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if (vnp_Params["vnp_ResponseCode"] === '00') {
            return res.redirect('/payment/success');
        }
    } else {
        return res.redirect('/payment/failure');
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports.getListTransaction = async function (req, res) {
    try {
        let transaction = await Transaction.find({});
        return res.status(200).json({
            data: transaction,
        })

    } catch (err) {
        return res.status(500).json({code: 1, error: 'server error'})
    }


}
// search transaction
module.exports.searchTransaction = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        if (req.query.orderId === '') {
            const transactions = await Transaction.find({});
            return res.status(200).json({
                code: 0,
                data: transactions,
            })
        }
        const transactions = await Transaction.find({
            $or: [
                {
                    orderId: {
                        $regex: orderId,
                        $options: 'i'
                    }
                }
            ]
        });
        if (!transactions) {
            return res.status(404).json({
                code: 0,
                message: 'transaction not found'
            })
        }
        if (transactions) {
            return res.status(200).json({
                code: 1,
                data: transactions
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, error: 'Server error'})
    }
}
