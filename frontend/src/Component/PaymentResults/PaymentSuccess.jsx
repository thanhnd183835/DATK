import React from 'react';
import Menu from "../Menu/Menu";
import "./PaymentSuccess.css"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import {useHistory} from 'react-router-dom';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


const PaymentSuccess = () => {
    const history = useHistory()
    return (
        <div>
            <div className={'page_success'}>
                <Menu/>
                <div className={"pageCenter"}>
                    <div className={'pageRight'}>
                        <CheckCircleOutlineIcon className={"iconSuccess"} style={{fontSize: 100}}/>
                        <div className={"NotificationTitle"}>Giao dịch Thành Công!</div>
                    </div>
                    <div style={{marginLeft:'17%'}}>
                        <ArrowBackIcon className={'arrowBackIcon'}/>
                        <button className={"back_list_button"}
                                onClick={() => {
                                    history.push('/listTransaction')
                                }}
                        >
                            Về danh sách
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default PaymentSuccess;
