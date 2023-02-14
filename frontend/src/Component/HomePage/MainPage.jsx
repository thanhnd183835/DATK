import React from "react";
import "./HomePage.css";
import logo from "../img/sI7ZtxVlhykDJnmWiqsDR43iclLgLzS94A.png"

const MainPage = () => {
    return (
            <div style={{
                marginTop: 100,
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center"
            }}>
                <div className={"title"}>Quản lý giao dịch qua VNPay</div>
                <div>
                    <img src={logo} style={{width:900}}/>
                </div>
            </div>
    )
}
export default MainPage;