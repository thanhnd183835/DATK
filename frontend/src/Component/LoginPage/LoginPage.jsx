import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import Grid from "@mui/material/Grid";
import lag_banner from "../img/lag_banner.svg"
import './LoginPage.css'
import SignIn from "./SignIn";


const LoginPage = () => {
    const [logined, setLogined] = useState(false);
    return logined ? (
        <Redirect to="/"/>
    ) : (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <div className="loginpage__main">
                        <div className="bannerWrapper">
                            <div className="banner">
                                <img src={lag_banner} style={{ height: '40vh' }}/>
                            </div>
                        </div>
                        <div className="middle">
                            <div className="loginPage__signin">
                                <SignIn logined={logined} setLogined={setLogined} />
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
export default LoginPage;