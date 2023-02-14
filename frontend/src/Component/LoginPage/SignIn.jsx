import React, {useState} from "react";
import {signIn} from "../Redux/auth/auth.slice";
import { useDispatch } from 'react-redux';
import  {useHistory} from 'react-router-dom';
import {showModalMessage} from "../Redux/message/message.slice";
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const history = useHistory();
    const handleLogin = async () =>{
        localStorage.clear();
        const body ={
            email: email,
            password: password,
        };
        const res = await dispatch(signIn(body));
        if(res?.payload?.data?.code === 0){
            await localStorage.setItem('token', res.payload.data.token);
            await history.push('/');
        } else if (res.payload.response?.status === 404 ){
            dispatch(
                showModalMessage({
                    type:'ERROR',
                    msg:'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại'
                })
            )
        }
    }
    return (
        <div>
            <p className="text-fields">Tên đăng nhập</p>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="logipage__text"
            />
            <p className="text-fields">Mật khẩu</p>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="logipage__text"
            />
            <button onClick={handleLogin} className="login__button">Log In</button>
        </div>
    )
}
export default SignIn;