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
        const formatDateId = dateFormat(date, "isoDateTime");
        const dateId = formatDateId.slice(0, 19).replace(/[-T:]/g, '');
        const orderId = dateId.slice(8, 14);
        console.log(orderId, '2222222')
        const createDate = dateId;
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
        try {
            const createdTransaction = await transaction.save();
            if (createdTransaction) {
                await User.findOneAndUpdate({_id: req.user._id},
                    {$push: {transactions: {transactionId: transaction._id}}})
            }

        } catch (e) {
            return res.status(500).json({error: "loi khi tao giao dich"});
        }

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
        console.log(err);
    }
};

module.exports.vnpay_ipn = async function (req, res) {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        const secretKey = config.vnp_HashSecret;
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
            const currentTransaction = await Transaction.findOne({orderId: orderId});
            if (currentTransaction.orderId === orderId) {
                if (currentTransaction.amount === amount/100) {
                    if (currentTransaction.TransactionStatus === '0') {
                        if (rspCode === '00' && tsCode ==='00') {
                            const upDateStatus = await Transaction.findOneAndUpdate({orderId: orderId,}, {status: 1});
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
    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, {encode: false});
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
        try {
            const orderId = vnp_Params["vnp_TxnRef"];
            let paymentResults = Transaction.findOne({orderId: orderId});
            return res.status(200).json({
                data: paymentResults,
            })

        } catch (err) {
            return res.status(500).json({code: 1, error: 'server error'})
        }
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
// list
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
// delete transaction
module.exports.deleteTransaction = async (req, res) => {
    try {
        const idTransaction = req.params.id;
        const userUpdate = await User.findOneAndUpdate(
            {'transactions.transactionId': idTransaction},
            {$pull: {transactions: {transactionId: idTransaction}}});
        if (!userUpdate) {
            return res.status(404).json({code: 0, message: 'user not found'});
        }
        const deleteTransaction = await Transaction.findOneAndRemove({_id: idTransaction});
        if (!deleteTransaction) {
            return res.status(404).json({code: 0, message: 'transaction not found!'})
        }
        if (deleteTransaction) {
            return res.status(200).json({
                code: 1,
                message: 'Delete Forever transaction success'
            })
        }
    } catch (error) {
        return res.status(500).json({error: 'Server error'})
    }
}

// get transaction by id.
module.exports.getOneTransactionId = async (req, res) => {
    try {
        const IdTransaction = req.params.id;
        const infoTransaction = await Transaction.findOne({_id: IdTransaction});
        if (!infoTransaction) {
            return res.status(404).json({code: 0, message: 'transaction not found'})
        }
        ;
        if (infoTransaction) {
            return res.status(200).json({
                code: 1,
                data: infoTransaction,
            })
        }
    } catch (error) {
        return res.status(500).json({error: 'Server error'})
    }
}
