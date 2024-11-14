import {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import './Home.css'

function Home() {
    const [songs, setSongs] = useState({});
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    useEffect(() => {
        async function getSongs() {
            try {
                const data = await axios.get("http://localhost:8000/songs")
                setSongs(data.data)
            } catch (error) {
                console.log(error)
            }
        }

        getSongs()

    }, [])

    function togglePlaySong(){
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)

    }

    function nextSong() {
        let key = parseInt(currentSongIndex)
        key ++
        if (key > Object.keys(songs).length-1) {
            key = 0
        }
        playSong(key)
    }

    function prevSong() {
        let key = currentSongIndex
        key --
        if (key < 0){
            key = Object.keys(songs).length-1
        }
        playSong(key)
    }

    function playSong(key) {
        var songName
        setCurrentSongIndex(key)
        songName = songs[key]
        audioRef.current.src = `http://localhost:8000/play?song=${encodeURIComponent(songName)}`
        setIsPlaying(true)
        audioRef.current.load()
        audioRef.current.play()
    }


    return (
        <div id='home'>
            <div id="song-list">
                <ul>
                    {Object.entries(songs).map(([index, song]) => {
                        return (
                            <li>
                                <button key={index} onClick={() => playSong(index)}>
                                    {song}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div id='audio-player'>
                <div id='current-song'>
                    {songs[currentSongIndex]}
                </div>
                <div id='controls'>
                    <button id='toggle-play' onClick={() => togglePlaySong()}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
                    <button id='toggle-shuffle'>SHUFFLE</button>
                    <button id='audio-next' onClick={() => prevSong()}>PREV</button>
                    <button id='audio-prev' onClick={() => nextSong()}>NEXT</button>
                </div>
                <audio ref={audioRef}></audio>
            </div>
        </div>
    )
}

export default Home;