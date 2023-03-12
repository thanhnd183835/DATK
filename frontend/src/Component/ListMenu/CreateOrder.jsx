import React, {useEffect} from "react";
import './CreateOrder.css'
import axios from 'axios';

import {
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
} from 'react-admin';
import dateFormat from "dateformat";
import {Typography, Box} from "@material-ui/core";
import {BASE_URL} from "../ultils/constants";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Menu from "../Menu/Menu";


const commodities = [
    {id: 100000, name: 'Thực Phẩm - Tiêu Dùng'},
    {id: 110000, name: 'Điện thoại - Máy tính bảng'},
    {id: 120000, name: 'Điện gia dụng'},
    {id: 130000, name: 'Máy tính - Thiết bị văn phòng'},
    {id: 140000, name: 'Điện tử - Âm thanh'},
    {id: 150000, name: 'Sách/Báo/Tạp chí'},
    {id: 160000, name: 'Thể thao, dã ngoại'},
    {id: 170000, name: 'Khách sạn & Du lịch'},
    {id: 180000, name: 'Ẩm thực'},
    {id: 190000, name: 'Giải trí & Đào tạo'},
    {id: 200000, name: 'Thời trang'},
    {id: 210000, name: 'Sức khỏe - Làm đẹp'},
    {id: 220000, name: 'Mẹ & Bé'},
    {id: 230000, name: 'Vật dụng nhà bếp'},
    {id: 240000, name: 'Xe cộ - phương tiện'},
    {id: 250000, name: 'Thanh toán hóa đơn'},
    {id: 250007, name: 'ĐVé máy bay'},
    {id: 260000, name: 'Mua mã thẻ'},
    {id: 270000, name: 'Nhà thuốc - Dịch vụ y tế'},
]
const bank = [
    {id: '', name: 'Không chọn'},
    {id: 'mobileBanking', name: 'Ứng dụng mobileBanking'},
    {id: 'LOCAL', name: 'LOCAL BANK'},
    {id: 'InternetBanking', name: 'INTERNET BANKING'},
    {id: 'VNPAYQR', name: 'VNPAY QR'},
    {id: 'ATMCARD', name: 'ATM CARD'},
    {id: 'InternationalCard', name: 'INTERNATIONAL CARD'},
    {id: 'VISA', name: 'Thẻ VISA'},
    {id: 'MasterCard', name: 'MASTER CARD'},
    {id: 'JCB', name: 'JCB'},
    {id: 'UPI', name: 'UPI'},
    {id: 'VIB', name: 'VIB'},
    {id: 'Vietcapital', name: 'VIETCAPITAL BANK'},
    {id: 'NCB', name: 'Ngân hàng NCB'},
    {id: 'SCB', name: 'Ngân hàng SCB'},
    {id: 'SACOMBANK', name: 'Ngân hàng SACOMBANK'},
    {id: 'EXIMBANK', name: 'Ngân hàng EXIMBANK'},
    {id: 'MSBANK', name: 'Ngân hàng MSBANK'},
    {id: 'NAMABANK', name: 'Ngân hàng NAMABANK'},
    {id: 'VNMART', name: 'Ngân hàng VNMART'},
    {id: 'VIETTINBANK', name: 'Ngân hàng VIETTINBANK'},
    {id: 'VIETCOMBANK', name: 'Ngân hàng VIETCOMBANK'},
    {id: 'HDBANK', name: 'Ngân hàng HDBANK'},
    {id: 'DONGABANK', name: 'Ngân hàng DONG A'},
    {id: 'TPBANK', name: 'Ngân hàng TP BANK'},
    {id: 'OCEANBANK', name: 'Ngân hàng OCEAN BANK'},
    {id: 'BIDV', name: 'Ngân hàng BIDV'},
    {id: 'TECHCOMBANK', name: 'Ngân hàng TECHCOMBANK'},
    {id: 'VPBANK', name: 'Ngân hàng VP BANK'},
    {id: 'AGRIBANK', name: 'Ngân hàng AGRIBANK'},
    {id: 'MBBANK', name: 'Ngân hàng MB BANK'},
    {id: 'ACB', name: 'Ngân hàng ACB'},
    {id: 'OCB', name: 'Ngân hàng OCB'},
    {id: 'SHB', name: 'Ngân hàng SHB'},
    {id: 'IVB', name: 'Ngân hàng IVB'},
];
const date = new Date();
const dateFormat1 = dateFormat(date, 'yyyy-mm-dd HH:MM:ss')

const useStyles = makeStyles((theme) => ({
    saveButton: {
        float: 'right',
        marginRight: '100px',
        height: '45px',
        width: '250px'
    },
    formBody: {
        minWidth: '95%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    title: {
        color: 'red',
        fontSize: '30px',
        textTransform: "uppercase",
        marginLeft: '10px',
        width: '100%',
        paddingBottom:'20px'
    }
}))
const CreateOrder = (props) => {
    const classes = useStyles();
    const handleSubmitForm = (data) => {
        axios({
            method: 'POST',
            url: `${BASE_URL}/transaction/create_payment_url`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            data: data,
        }).then((response) => {
            // console.log(response);
            if (response) {
                // @ts-ignore1
                window.open(response.data.data, '_self')
            }
        });
    };

    return (
        <div className={'homePageCreate'}>
            <Menu/>
            <SimpleForm
                className={'SimpleForm'}
                save={handleSubmitForm}
                title={'Thanh toán đơn hàng'}
                toolbar={
                    <SaveButton
                        className={classes.saveButton}
                        label={"Tạo đơn hàng"}
                    />}
            >
                <Typography variant="h6" className={classes.title}>
                    Thanh Toán đơn hàng
                </Typography>
                <div className={classes.formBody}>
                    <SelectInput
                        fullWidth={true}
                        label="Loại hàng hóa /Commodities"
                        choices={commodities}
                        source="orderType"
                    />
                    <TextInput
                        fullWidth
                        source="amount"
                        resource="amount"
                        label="Số tiền/Amount of money"
                    />
                    <TextInput
                        fullWidth
                        source="orderDescription"
                        resource="orderDescription"
                        label="Nội dung thanh toán/content"
                        defaultValue={'Thanh toán đơn hàng thời gian: ' + `${dateFormat1}`}
                    />
                    <SelectInput
                        fullWidth={true}
                        defaultValue={''}
                        label="Ngân hàng/ Bank"
                        choices={bank}
                        source="bankCode"
                    />
                    <SelectInput
                        fullWidth={true}
                        source="language"
                        label="Ngôn ngữ/ Language"
                        defaultValue={'vn'}
                        choices={[
                            {id: 'vn', name: 'Vietnamese'},
                            {id: 'en', name: 'English'},
                        ]}
                    />
                </div>
            </SimpleForm>
        </div>
    );
};
export default CreateOrder;