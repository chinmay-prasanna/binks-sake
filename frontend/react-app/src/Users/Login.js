import {useEffect, useState} from 'react'
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function loginUser() {
        console.log(username, password)
        try {
            const {data} = await axios.post("http://localhost:8000/api/token/", {username: username, password: password})
            const access_token = data.access_token
            localStorage.setItem("access", access_token)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <input onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
            <input onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
            <button type='submit' onClick={loginUser}>Submit</button>
        </div>
    )
}

export default Login;