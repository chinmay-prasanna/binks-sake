import {useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    async function createUser() {
        try {
            const {data} = await axios.post("http://localhost:8000/user/create/", {username: username, email: email, password: password})
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <input onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
            <input onChange={(e) => setEmail(e.target.value)} placeholder='email'></input>
            <input onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
            <button type='submit' onClick={createUser}>Submit</button>
        </div>
    )
}

export default Signup;