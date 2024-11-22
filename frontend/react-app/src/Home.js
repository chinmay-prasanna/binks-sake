import { useEffect, useState, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import ListDirectory from './Directory/ListDirectory';
import Songs from './Player/Songs';
import Player from './Player/AudioPlayer';
import Login from './Users/Login'

function Home() {
    const [currentDirectoryId, setCurrentDirectory] = useState(null)
    const [songs, setSongs] = useState([]);
    const [curSongIndex, setCurrentSongIndex] = useState(0)
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const access = localStorage.getItem("access")
        if (access) {
            try {
                const decodedToken = jwtDecode(access);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setIsTokenValid(true)
                    setIsLoggedIn(true)
                } else {
                    setIsTokenValid(false)
                    const refresh = localStorage.getItem("refresh")
                    const decodedToken = jwtDecode(access);
                    const currentTime = Math.floor(Date.now() / 1000);
    
                    if (decodedToken.exp && decodedToken.exp > currentTime) {
                        const response = axios.post("http://localhost:8000/api/token/refresh/", { refresh:refresh })
                        localStorage.setItem("access", response.data.access_token)
                        setIsTokenValid(true)
                        setIsLoggedIn(true)
                    } else {
                        setIsTokenValid(false)
                        setIsLoggedIn(false)
                    }
                }
                
            } catch (error) {
                console.error("Invalid token", error);
            }
        }

        if (!isTokenValid) {
            setIsLoggedIn(false)
        }
        console.log(isLoggedIn)
    }, [])

    useEffect(() => {
        let song = songs[curSongIndex]
        if (song){
            let songName = song.file
            audioRef.current.src = `http://localhost:8000/play?dir=${currentDirectoryId}&song=${encodeURIComponent(songName)}`
            audioRef.current.load()
            if (isPlaying) {
                audioRef.current.play()
            }
        }

    }, [curSongIndex])

    function playSong(key) {
        setIsPlaying(true)
        setCurrentSongIndex(key)
    }

    return (
        <div>
            <div className='auth-modal' style={{
                display: isLoggedIn ? 'none' : 'block'
            }}><Login setIsLoggedIn={setIsLoggedIn}/></div>
            <div id='home'>
                {isLoggedIn && (<ListDirectory setCurrentDirectory={setCurrentDirectory} />)}

                {/* <div className='vl'></div> */}
                {currentDirectoryId && (
                    <Songs
                        directoryId={currentDirectoryId}
                        setSongs={setSongs}
                        songs={songs}
                        playSong={playSong}
                    />
                )}

                {/* <div className='vl'></div> */}
                {(<Player songs={songs} playSong={playSong} audioRef={audioRef} currentSongIndex={curSongIndex} isPlaying={isPlaying} isLoggedIn={isLoggedIn} />)}
            </div>
        </div>
    )
}

export default Home;