import {useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css'
import Button from 'react-bootstrap/esm/Button';

function Login({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [loginTabSelected, setLoginTabSelected] = useState(true)

    async function loginUser() {
        console.log(username, password)
        try {
            const {data} = await axios.post("http://localhost:8000/api/token/", {username: username, password: password})
            const access_token = data.access_token
            localStorage.setItem("access", access_token)
            setIsLoggedIn(true)
        } catch (error) {
            console.error(error)
        }
    }    
    async function signUpUser() {
        console.log(username, password)
        try {
            const {data} = await axios.post("http://localhost:8000/user/create/", {username: username, password: password, email: email})
            setLoginTabSelected(true)
        } catch (error) {
            console.error(error)
        }
    }

    function toggleLoginTab(isLoginTabSelected) {
        setLoginTabSelected(isLoginTabSelected)
    }

    return (
        <div className='auth-form'>
            <div id="auth-container">
            <div className='tabs'>
                <div id='login-tab' onClick={() => toggleLoginTab(true)}
                    style={{
                        textDecoration: loginTabSelected ? 'underline' : 'none'
                    }}
                >login</div>
                <div id='signup-tab' onClick={() => toggleLoginTab(false)}
                    style={{
                        textDecoration: loginTabSelected ? 'none' : 'underline'
                    }}
                >signup</div>
            </div>
            <div id="signup-form" className='form'
                style={{
                    display: loginTabSelected ? 'none' : 'flex'
                }}>
                <input id="form-input" onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
                <input id="form-input" onChange={(e) => setEmail(e.target.value)} placeholder='email'></input>
                <input id="form-input" onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                <Button id="signup-submit-button" size="sm" variant="dark" onClick={() => signUpUser()}>Sign Up</Button>
            </div>
            <div id="login-form" className='form'
                style={{
                    display: loginTabSelected ? 'flex' : 'none'
                }}>
                <input id="form-input" onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
                <input id="form-input" onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                <Button id="login-submit-button" size="sm" variant="dark" onClick={() => loginUser()}>Login</Button>
            </div>
            </div>
        </div>
    )
}

export default Login;