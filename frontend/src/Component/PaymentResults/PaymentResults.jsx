import React, {useState} from 'react';
import Menu from "../Menu/Menu";
import "./PaymentResults.css";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {useHistory} from 'react-router-dom';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const colums = [
    {id: 'orderId', label: 'Mã đơn hàng', align: 'center'},
    {id: 'amount', label: 'Số tiền', align: 'center'},
    {id: 'bankCode', label: 'Ngân Hàng', align: 'center'},
    {id: 'orderInfo', label: 'Nội dung', align: 'center'},
    {id: 'status', label: 'Trạng thái', align: 'center'},
];
const PaymentResults = () => {
    const [openMenu, setOpenMenu] = useState(true);
    const history = useHistory();
    // Lấy chuỗi query string từ URL hiện tại
    const queryString = window.location.search;
    // Tách chuỗi query string thành các cặp key-value
    const params = new URLSearchParams(queryString);
    // Lưu các cặp key-value vào một đối tượng
    const paramsObj = {}
    for (const [key, value] of params.entries()) {
        paramsObj[key] = value;
    }
    ;
    const rows = [
        {label: paramsObj.vnp_TxnRef},
        {label: paramsObj.vnp_Amount/100},
        {label: paramsObj.vnp_BankCode},
        {label: paramsObj.vnp_OrderInfo},
        {label: paramsObj.vnp_ResponseCode}
    ];
    const translateResponseCode = {
        "00": " Giao dịch thành công",
        "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
        "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
        "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
        "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
        "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
        "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
        "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
        "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
        "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
        "75": "Ngân hàng thanh toán đang bảo trì.",
        "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
        "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
    };
    const responseCode = [paramsObj.vnp_ResponseCode];
    const message = translateResponseCode[responseCode]

    const changeOpenMenu = (value) => {
        value ?
            setOpenMenu(true) : setOpenMenu(false)
    }
    return (
        <div className={`homePageListOrder open-menu-${openMenu ? 'true' : 'false'}`}>
            <Menu changeOpenMenu={(value) => changeOpenMenu(value)}/>
            <TableContainer className={"table-results"}>
                <div className={"Title-results"}>
                    <h2 style={(responseCode === "00") ? {color: '#0926d7'} : {color: "#e7092b"}}>{message}</h2>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            {colums.map((column) => (
                                <TableCell key={column.id} align={column.align}
                                           style={{color: '#0926d7', textTransform: 'uppercase'}}>
                                    {column.label}
                                </TableCell>
                            ))}

                        </TableRow>
                    </TableHead>
                    <TableBody className={"table-body"}>
                        <TableRow>
                            {rows.map((row) => (
                                <TableCell className={"table-row"} style={{textAlign: "center"}}>
                                    {row.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
                <div style={{marginTop: 50, textAlign: "center"}}>
                    <ArrowBackIcon className={'arrowBackIcon'}/>
                    <button
                        className={"back_list_button"}
                        onClick={() => {
                            history.push('/listTransaction')
                        }}
                    >
                        Về danh sách
                    </button>
                </div>
            </TableContainer>
        </div>
    )
}
export default PaymentResults;
