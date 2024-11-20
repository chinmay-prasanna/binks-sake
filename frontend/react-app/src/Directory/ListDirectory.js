import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button'
import './styles.css'
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ListDirectory({ setCurrentDirectory }) {
    const [directories, setDirectories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        async function getDirectories() {
            try {
                await axios.get("http://localhost:8000/directory/").then(response => {
                    setDirectories(response.data)
                    setCurrentDirectory(response.data[0].id)
                })
            } catch (error) {
                console.log(error)
            }
        }

        getDirectories()

    }, [])

    function toggleTab(dirId) {
        setCurrentDirectory(dirId)
    }

    function addDirectory() {
        navigate("/directory")
    }

    return (
        <div id="directory-tabs">
        <div id='heading'><h1>directories<div id="heading-ul"></div></h1></div>
            {directories.map((object, index) => {
                return <div id='dir-tab' onClick={() => toggleTab(object.id)} key={object.id}>{object.dir_path}/{object.dir_name}</div>
            })}
            <Button variant="dark" size="sm" onClick={addDirectory} id='add-dir-button'>add new</Button>
        </div>
    )
}

export default ListDirectory