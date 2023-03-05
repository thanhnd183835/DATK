import React, {useEffect, useState} from 'react';
import Menu from "../Menu/Menu";
import {useDispatch, useSelector} from "react-redux";
import "./infoTransaction.css"
import TableContainer from "@material-ui/core/TableContainer";
import {useHistory} from 'react-router-dom';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const commodities = {
    '100000': 'Thực Phẩm - Tiêu Dùng',
    '110000': 'Điện thoại - Máy tính bảng',
    '120000': 'Điện gia dụng',
    '130000': 'Máy tính - Thiết bị văn phòng',
    '140000': 'Điện tử - Âm thanh',
    '150000': 'Sách/Báo/Tạp chí',
    '160000': 'Thể thao, dã ngoại',
    '170000': 'Khách sạn & Du lịch',
    '180000': 'Ẩm thực',
    '190000': 'Giải trí & Đào tạo',
    '200000': 'Thời trang',
    '210000': 'Sức khỏe - Làm đẹp',
    '220000': 'Mẹ & Bé',
    '230000': 'Vật dụng nhà bếp',
    '240000': 'Xe cộ - phương tiện',
    '250000': 'Thanh toán hóa đơn',
    '250007': 'ĐVé máy bay',
    '260000': 'Mua mã thẻ',
    '270000': 'Nhà thuốc - Dịch vụ y tế',
};
const bank = {
    '': 'Không chọn',
    'mobileBanking': 'Ứng dụng mobileBanking',
    'LOCAL': 'LOCAL BANK',
    'InternetBanking': 'INTERNET BANKING',
    'VNPAYQR': 'VNPAY QR',
    'ATMCARD': 'ATM CARD',
    'InternationalCard': 'INTERNATIONAL CARD',
    'VISA': 'Thẻ VISA',
    'MasterCard': 'MASTER CARD',
    'JCB': 'JCB',
    'UPI': 'UPI',
    'VIB': 'VIB',
    'Vietcapital': 'VIETCAPITAL BANK',
    'NCB': 'Ngân hàng NCB',
    'SCB': 'Ngân hàng SCB',
    'SACOMBANK': 'Ngân hàng SACOMBANK',
    'EXIMBANK': 'Ngân hàng EXIMBANK',
    'MSBANK': 'Ngân hàng MSBANK',
    'NAMABANK': 'Ngân hàng NAMABANK',
    'VNMART': 'Ngân hàng VNMART',
    'VIETTINBANK': 'Ngân hàng VIETTINBANK',
    'VIETCOMBANK': 'Ngân hàng VIETCOMBANK',
    'HDBANK': 'Ngân hàng HDBANK',
    'DONGABANK': 'Ngân hàng DONG A',
    'TPBANK': 'Ngân hàng TP BANK',
    'OCEANBANK': 'Ngân hàng OCEAN BANK',
    'BIDV': 'Ngân hàng BIDV',
    'TECHCOMBANK': 'Ngân hàng TECHCOMBANK',
    'VPBANK': 'Ngân hàng VP BANK',
    'AGRIBANK': 'Ngân hàng AGRIBANK',
    'MBBANK': 'Ngân hàng MB BANK',
    'ACB': 'Ngân hàng ACB',
    'OCB': 'Ngân hàng OCB',
    'SHB': 'Ngân hàng SHB',
    'IVB': 'Ngân hàng IVB',
};
const InfoTransaction = (props) => {
    const history = useHistory();
    const TransactionInfo = useSelector((state) => state.transaction?.infoTransaction?.data)
    const [openMenu, setOpenMenu] = useState(true);
    const changeOpenMenu = (value) => {
        value ? setOpenMenu(true) : setOpenMenu(false)
    }
    useEffect(() => {
    }, [openMenu]);

    const typeOrder = TransactionInfo.orderType;
    const message = commodities[typeOrder];
    const codeBank = TransactionInfo.bankCode;
    const textBank = bank[codeBank];

    return (
        <div className={`homePageListOrder open-menu-${openMenu ? 'true' : 'false'}`}>
            <Menu changeOpenMenu={(value) => changeOpenMenu(value)}/>
            <TableContainer className={"table-results"}>
                <div>
                    <h2 className={'title'}>Chi tiết thông tin giao dịch</h2>
                </div>
                <div className={'info-transaction'}>
                    <div className={'info'}>
                        <p className={'info-title'}>Mã đơn hàng:</p>
                        <p>{TransactionInfo._id}.</p>
                    </div>
                    <div className={'info'}>
                        <p className={'info-title'}>Số tiền:</p>
                        <p>
                            {TransactionInfo.amount}.
                        </p>
                    </div>
                    <div className={'info'}>
                        <p className={'info-title'}>Nội dung: </p>
                        <p>
                            {TransactionInfo.orderInfo}.
                        </p>
                    </div>
                    <div className={'info'}>
                        <p className={'info-title'}>Loại hàng hóa:</p>
                        <p>{message}.</p>
                    </div>
                    <div className={'info'}>
                        <p className={'info-title'}>Ngân hàng thanh toán: </p>
                        <p>
                            {textBank}.
                        </p>
                    </div>
                   <div className={'info'}>
                       <p className={'info-title'}>Trạng thái:</p>
                       <p>
                           {TransactionInfo.TransactionStatus === 1
                               ? 'Đã thanh toán' : TransactionInfo.TransactionStatus === 0
                                   ? 'Chưa thanh toán' : 'Giao dịch thất bại'}.
                       </p>
                   </div>
                </div>
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
    );
}
export default InfoTransaction;