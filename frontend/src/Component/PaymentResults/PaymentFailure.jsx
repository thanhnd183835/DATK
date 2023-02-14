import React from 'react';
import Menu from "../Menu/Menu";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {useHistory} from 'react-router-dom';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import "./PaymentFailure.css"


const PaymentFailure = () => {
    const history = useHistory()
    return (
        <div>
            <div className={"page_failure"}>
                <Menu/>
                <div className={"pageCenter"}>
                    <div className={"pageRight"}>
                        <HighlightOffIcon className={"iconError"} style={{fontSize: 100}}/>
                        <div className={"NotificationTitle_fail"}>Giao dịch Thất Bại!</div>
                    </div>
                    <div style={{marginLeft:'20%'}}>
                        <ArrowBackIcon className={'arrowBackIcon'} />
                        <button
                            className={"back_list_button"}
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
export default PaymentFailure;
