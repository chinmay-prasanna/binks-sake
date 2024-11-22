import { useEffect, useState, useRef } from "react"
import Button from 'react-bootstrap/Button'
import './styles.css'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import api from "../api"

function ListDirectory({ setCurrentDirectory }) {
    const fileInputRef = useRef(null);
    const [directories, setDirectories] = useState([])
    const navigate = useNavigate()

    async function getDirectories() {
        try {
            await api.get("http://localhost:8000/directory/").then(response => {
                setDirectories(response.data)
                setCurrentDirectory(response.data[0].id)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDirectories()
        console.log(directories)
    }, [])

    function toggleTab(dirId) {
        setCurrentDirectory(dirId)
    }

    function addDirectory() {
        navigate("/directory")
    }

    function handleButtonClick() {
        fileInputRef.current.click();
    }
  
    async function handleDirectorySelect() {
        if (window.electron && window.electron.selectDirectory) {
            const directory = await window.electron.selectDirectory();
            if (directory) {
                let path = directory.path.substring(0, directory.path.lastIndexOf('/'))
                try {
                    await api.post("http://localhost:8000/directory/create/", {dir_name: directory.name, dir_path: path }).then(response => {
                        console.log(response.data)
                        setDirectories((prevDirectories) => [...prevDirectories, response.data])
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }
        console.log(directories)
    }

    return (
        <div id="directory-tabs">
        <div id='heading'><h1>directories<div id="heading-ul"></div></h1></div>
            <div id="directories-list">
            {directories.map((object, index) => {
                return <div id='dir-tab' onClick={() => toggleTab(object.id)} key={object.id}>{object.dir_path}/{object.dir_name}</div>
            })}
            </div>
            <Button variant="dark" size="sm" onClick={() => handleDirectorySelect()} id='add-dir-button'>add new</Button>
        </div>
    )
}

export default ListDirectory