import {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import ListDirectory from './Directory/ListDirectory';
import Songs from './Player/Songs';
import Player from './Player/AudioPlayer';

function Home() {
    const [currentDirectoryId, setCurrentDirectory] = useState(null)
    const [songs, setSongs] = useState([]);
    const [curSongIndex, setCurrentSongIndex] = useState(0)
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        let songName = songs[curSongIndex]
        audioRef.current.src = `http://localhost:8000/play?dir=${currentDirectoryId}&song=${encodeURIComponent(songName)}`
        audioRef.current.load()
        if (isPlaying) {
            audioRef.current.play()
        }

    }, [curSongIndex])

    function playSong(key) {
        setIsPlaying(true)
        setCurrentSongIndex(key)
    }

    return (
        <div id='home'>
            <ListDirectory setCurrentDirectory={setCurrentDirectory} />

            <div className='vl'></div>
            {currentDirectoryId && (
                <Songs 
                    directoryId={currentDirectoryId} 
                    setSongs={setSongs}
                    songs={songs}
                    playSong={playSong}
                />
            )}

            <div className='vl'></div>
            {<Player songs={songs} playSong={playSong} audioRef={audioRef} currentSongIndex={curSongIndex} isPlaying={isPlaying}/>}
        </div>
    )
}

export default Home;