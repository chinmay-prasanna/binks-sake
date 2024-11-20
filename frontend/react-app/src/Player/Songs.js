import { useEffect, useState, useRef } from "react";
import Button from 'react-bootstrap/Button'
import './styles.css'
import axios from "axios";

function Songs({ directoryId, setSongs, songs, playSong }) {
    const songListRef = useRef(null)
    
    useEffect (() => {
        async function getSongs() {
            try {
                let url = `http://localhost:8000/songs?directory_id=${directoryId}`
                await axios.get(url).then(response => {
                    setSongs(response.data)
                })
            } catch (error) {
                console.log(error)
            }
        }

        getSongs()

    }, [directoryId])

    return (
        <div id="song-list" ref={songListRef}>
            <ul>
                {Object.entries(songs).map(([index, song]) => {
                    return (
                        <li id="song-item">
                            <Button size="sm" variant="dark" key={index} onClick={() => playSong(index)}>
                                {song}
                            </Button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Songs