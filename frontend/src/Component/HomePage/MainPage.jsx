import React from "react";
import "./HomePage.css";
import logo from "../img/du-an-sunshine-city-saigon-9-1400x788.jpg"

const MainPage = () => {
    return (
            <div style={{
                marginTop: 100,
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center"
            }}>
                <div className={"title"}>Quản lý giao dịch</div>
                <div>
                    <img src={logo} style={{width:1000}} alt={'ảnh chung cư'}/>
                </div>
            </div>
    )
}
export default MainPage;