import {Redirect} from "react-router-dom";
import React from 'react';
import Menu from "../Menu/Menu";
import MainPage from "./MainPage";

const HomePage = props => {
    return !localStorage.getItem('token') ? (<Redirect to="/login"/>) : (
        <div className={'homePage'}>
            <Menu/>
            <MainPage/>
        </div>
    )
}
export default HomePage;
