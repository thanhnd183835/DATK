import React, {useEffect} from "react";
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from './Component/LoginPage/LoginPage'
import {useDispatch} from "react-redux";
import {hideModalMessage} from "./Component/Redux/message/message.slice";
import ProtectedRoute from "./Component/ProtectedRoute";
import CreateOrder from "./Component/ListMenu/CreateOrder";
import PaymentResults from "./Component/PaymentResults/PaymentResults";
import HomePage from "./Component/HomePage/Homepage";
import ListAllOrder from "./Component/ListMenu/ListAllOrder";
import InfoTransaction from "./Component/InfoTransaction/infoTransaction";



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
                <ProtectedRoute exact path="/paymentResults" component={PaymentResults}/>
                <ProtectedRoute exact path="/infoTransaction/:id" component={InfoTransaction}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App;