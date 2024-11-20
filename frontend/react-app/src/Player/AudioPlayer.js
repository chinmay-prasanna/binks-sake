import { useState, useEffect, useRef } from "react"
import Button from 'react-bootstrap/Button'

function Player({ songs, playSong, audioRef, currentSongIndex, isPlaying }) {
    const [isShuffled, setIsShuffled] = useState(false)

    const timeRef = useRef(null)
    const audioTrackRef = useRef(null)

    const [seekbarWidth, setSeekbarWidth] = useState(0);
    const [iconPosition, setIconPosition] = useState(0);
    const [seekbarVisible, setSeekbarVisible] = useState(false);

    const [currentQueue, setCurrentQueue] = useState([])
    const [curSongName, setCurSongName] = useState('')

    const [paused, setPaused] = useState(true)


    useEffect(() => {
        setCurrentQueue(songs)

    }, [songs])

    useEffect(() => {
        setCurSongName(songs[currentSongIndex])

    }, [currentSongIndex])

    useEffect(() => {
        if(isPlaying){
            setPaused(false)
        } else {
            setPaused(true)
        }
    }, [isPlaying])

    function togglePlaySong(){
        if (paused) {
            audioRef.current.play()
            setPaused(false)
        } else {
            audioRef.current.pause()
            setPaused(true)
        }

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

    const onTimeUpdate = () => {
        if (audioRef.current && timeRef.current) {
            const audioTime = Math.round(audioRef.current.currentTime);
            const audioLength = Math.round(audioRef.current.duration);
            const progress = (audioTime * 100) / audioLength;

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

    return (
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
                    <div class="time" ref={timeRef}></div>
            </div>
            <p></p>
            <div id='controls'>
                <Button variant='light' size="sm" id='toggle-play' onClick={() => togglePlaySong()}>{paused ? 'PLAY' : 'PAUSE'}</Button>
                {/* <Button variant='light' size="sm" id='toggle-shuffle' onClick={() => toggleShuffle()}style={{backgroundColor: isShuffled ? 'black' : 'white', color: isShuffled ? 'white' : 'black'}}>SHUFFLE</Button> */}
                <Button variant='light' size="sm" id='audio-next' onClick={() => prevSong()}>PREV</Button>
                <Button variant='light' size="sm" id='audio-prev' onClick={() => nextSong()}>NEXT</Button>
            </div>
            <audio ref={audioRef}></audio>
        </div>
    )
}

export default Player