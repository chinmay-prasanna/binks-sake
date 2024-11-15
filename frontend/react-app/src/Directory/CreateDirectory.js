import {useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateDirectory() {
    const navigate = useNavigate()
    const [dirName, setDirName] = useState('');
    const [dirPath, setDirPath] = useState('');
    const [dirDescription, setDirDesc] = useState(null)

    async function createDirectory() {
        try {
            const {data} = await axios.post("http://localhost:8000/directory/create/", {dir_name: dirName, dir_path: dirPath, description: dirDescription})
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <input onChange={(e) => setDirName(e.target.value)} placeholder='Directory Name'></input>
            <input onChange={(e) => setDirPath(e.target.value)} placeholder='Directory Path'></input>
            <input onChange={(e) => setDirDesc(e.target.value)} placeholder='Description'></input>
            <button type='submit' onClick={createDirectory}>Submit</button>
        </div>
    )
}

export default CreateDirectory;