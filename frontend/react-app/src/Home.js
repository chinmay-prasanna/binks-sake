import {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [songs, setSongs] = useState({});
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShuffled, setIsShuffled] = useState(false)
    const [shuffleQueue, setShuffleQueue] = useState({})
    const [currentQueue, setCurerentQueue] = useState({})
    const [curSongName, setCurSongName] = useState('')
    const [elapsedTime, setElapsedTime] = useState('')
    const audioRef = useRef(null)
    const audioTrackRef = useRef(null)
    const timeRef = useRef(null)
    const songListRef = useRef(null)
    const [seekbarWidth, setSeekbarWidth] = useState(0);
    const [iconPosition, setIconPosition] = useState(0);
    const [seekbarVisible, setSeekbarVisible] = useState(false);
    const [directories, setDirectories] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        async function getSongs(directoryId = null) {
            try {
                let url = `http://localhost:8000/songs`
                if (directoryId) {
                    url += `?directory_id=${currentDirectory}`
                }
                const data = await axios.get(url)
                setSongs(data.data)
                setCurerentQueue(data.data)
                setCurSongName(data.data[0])
            } catch (error) {
                console.log(error)
            }
        }

        async function getDirectories() {
            try {
                const data = await axios.get("http://localhost:8000/directory/")
                setDirectories(data.data)
                setCurrentDirectory(data.data[0].id)
            } catch (error) {
                console.log(error)
            }
        }

        getDirectories()
        getSongs()

    }, [])

    async function getSongs(directoryId = null) {
        try {
            let url = `http://localhost:8000/songs`
            if (directoryId) {
                url += `?directory_id=${currentDirectory}`
            }
            const data = await axios.get(url)
            setSongs(data.data)
            setCurerentQueue(data.data)
            setCurSongName(data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    function togglePlaySong(){
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            if (!audioRef.current.src) {
                audioRef.current.src =`http://localhost:8000/play?song=${encodeURIComponent(songs[currentSongIndex])}`
                audioRef.current.load()
            }
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)

    }

    function nextSong() {
        let key = parseInt(currentSongIndex)
        key ++
        console.log(key)
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

    function toggleShuffle() {
        if (isShuffled) {
            let key = Object.keys(songs).find(key => songs[key]==shuffleQueue[currentSongIndex])
            console.log(key)
            setCurrentSongIndex(key)
            setCurerentQueue(songs)
        } else {
            const values = Object.values(songs);
            for (let i = values.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [values[i], values[j]] = [values[j], values[i]];
            }

            const shuffledDict = Object.keys(songs).reduce((acc, key, index) => {
              acc[key] = values[index];
              return acc;
            }, {});
            setShuffleQueue(shuffledDict)
            setCurerentQueue(shuffledDict)
        }
        setIsShuffled(!isShuffled)
    }

    function onSeekBarMouseEnter(event) {
        const rect = audioTrackRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        setSeekbarWidth(offsetX);
        setIconPosition(offsetX);
        setSeekbarVisible(true);
    }

    function onSeekBarMouseLeave() {
        setSeekbarWidth(0);
        setIconPosition(0)
        setSeekbarVisible(false);
    }

    function onSeek(event) {
        const rect = audioTrackRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = offsetX / audioTrackRef.current.offsetWidth;
        audioRef.current.currentTime = percentage * audioRef.current.duration;
    }

    function playSong(key) {
        var songName

        setCurrentSongIndex(key)
        setIsPlaying(true)

        songName = currentQueue[key]
        
        audioRef.current.src = `http://localhost:8000/play?song=${encodeURIComponent(songName)}`
        audioRef.current.load()
        audioRef.current.play()

        setCurSongName(currentQueue[key])
    }

    const onTimeUpdate = () => {
        if (audioRef.current && timeRef.current) {
            const audioTime = Math.round(audioRef.current.currentTime);
            const audioLength = Math.round(audioRef.current.duration);
            const progress = (audioTime * 100) / audioLength;

            setElapsedTime(audioTime)
            timeRef.current.style.width = `${progress}%`;
        }
    };

    useEffect(() => {
        const player = audioRef.current;
        if (player) {
            player.addEventListener('timeupdate', onTimeUpdate);
        }

        return () => {
            if (player) {
                player.removeEventListener('timeupdate', onTimeUpdate);
            }
        };
    }, []);

    function addDirectory(){
        navigate("/directory")
    }

    function toggleTab(dirId) {
        setCurrentDirectory(dirId)
        getSongs(dirId)
    }
    
    return (
        <div id='home'>
            <div id="directory-tabs">
                {directories.map((object, index) => {
                    return <div id='dir-tab' onClick={() => toggleTab(object.id)} key={object.id}>{object.dir_path}/{object.dir_name}</div>
                })}
                <button onClick={addDirectory}>Add directory</button>
            </div>
            <div id="song-list" ref={songListRef}>
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
                    {curSongName}
                </div>                
                <div className="audio-track" ref={audioTrackRef} onMouseMove={(e) => onSeekBarMouseEnter(e)} onMouseLeave={(e) => onSeekBarMouseLeave()} onClick={(e) => onSeek(e)}>
                        <div class="seekbar" 
                                style={{
                                    width: `${seekbarWidth}px`,
                                    opacity: seekbarVisible ? 1 : 0,
                                }}>
                            <div class="seekbar-icon"
                                style={{
                                    left: `${iconPosition}px`,
                                    opacity: seekbarVisible ? 1 : 0,
                                }}>
                            </div>
                        </div>
                        <div class="time" ref={timeRef}>{elapsedTime}</div>
                </div>
                <p></p>
                <div id='controls'>
                    <button id='toggle-play' onClick={() => togglePlaySong()}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
                    <button id='toggle-shuffle' onClick={() => toggleShuffle()}>SHUFFLE</button>
                    <button id='audio-next' onClick={() => prevSong()}>PREV</button>
                    <button id='audio-prev' onClick={() => nextSong()}>NEXT</button>
                </div>
                <audio ref={audioRef}></audio>
            </div>
        </div>
    )
}

export default Home;