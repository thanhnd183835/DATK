import React, {useEffect} from "react";
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage'
import {useDispatch} from "react-redux";
import {hideModalMessage} from "./Component/Redux/message/message.slice";
import Menu from "./Component/Menu/Menu";
import ProtectedRoute from "./Component/ProtectedRoute";
import CreateOrder from "./Component/ListMenu/CreateOrder";
import PaymentSuccess from "./Component/PaymentResults/PaymentSuccess";
import HomePage from "./Component/HomePage/Homepage";
import ListAllOrder from "./Component/ListMenu/ListAllOrder";
import PaymentFailure from "./Component/PaymentResults/PaymentFailure";

function App(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideModalMessage());
    }, []);
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <ProtectedRoute exact path="/" component={HomePage}/>
                <ProtectedRoute exact path="/order" component={CreateOrder}/>
                <ProtectedRoute exact path="/listTransaction" component={ListAllOrder}/>
                <ProtectedRoute exact path="/payment/success" component={PaymentSuccess}/>
                <ProtectedRoute exact path="/payment/failure" component={PaymentFailure}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App;