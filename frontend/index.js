
let shuffleEnabled = false
let currentQueue
let normalQueue = []
let shuffleQueue = []
let curSongIndex = 0
let currentSongDuration = null

let controls = document.getElementById("controls")

let audioTrack = controls.querySelector(".audio-track")

let seekbar = audioTrack.querySelector(".seekbar")
let seekbarIcon = seekbar.querySelector('.seekbar-icon')

let time = controls.querySelector(".time");
let btnPlay = controls.querySelector(".play");
let btnPause = controls.querySelector(".pause");
let btnPrev = controls.querySelector(".prev");
let btnNext = controls.querySelector(".next");
let btnShuffle = controls.querySelector(".shuffle")
let currentSong = document.getElementById("playing-song")

async function onSeekBarMouseEnter(event){
    const rect = audioTrack.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    seekbar.style.width = `${offsetX}px`;
    seekbar.style.opacity = 1

    seekbarIcon.style.left = `${offsetX}px`
    seekbarIcon.style.opacity = 1
}

async function onSeekBarMouseLeave() {
    seekbar.style.width = 0
    seekbar.style.opacity = 0
}

async function onSeek(event) {
    const rect = audioTrack.getBoundingClientRect();
    const offsetX = event.clientX - rect.left; 
    const percentage = offsetX / audioTrack.offsetWidth;
    player.currentTime = percentage * player.duration
}

async function onPlayClick() {
    player.play()
}

async function onPauseClick() {
    player.pause()
}

async function onShuffleToggle(){
    function shuffle(array) {
        let copyArray = [...array]
        let currentIndex = copyArray.length;
        while (currentIndex != 0) {
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [copyArray[currentIndex], copyArray[randomIndex]] = [
            copyArray[randomIndex], copyArray[currentIndex]];
        }
        return copyArray
    }

    shuffleEnabled = !shuffleEnabled
    if (shuffleEnabled) {
        shuffleQueue = shuffle(normalQueue)
        btnShuffle.classList.add('enabled')
        btnShuffle.classList.remove('disabled')
        currentQueue = shuffleQueue
    }
    else{
        btnShuffle.classList.remove('enabled')
        btnShuffle.classList.add('disabled')
        currentQueue = normalQueue
    }
}

async function onPrevClick() {
    curSongIndex = currentQueue.indexOf((currentPlayingSong))
    curSongIndex --
    if (curSongIndex < 0) {
        curSongIndex = currentQueue.length-1
    } 
    playSong(currentQueue[curSongIndex])
}

async function onNextClick(){
    curSongIndex = currentQueue.indexOf(currentPlayingSong)
    curSongIndex ++
    if (curSongIndex > currentQueue.length-1) {
        curSongIndex = 0
    }
    playSong(currentQueue[curSongIndex])
}

document.addEventListener('DOMContentLoaded',() => {
    load_and_create_queue()
    const searchField = document.getElementById("song-search")
    searchField.addEventListener('input', fetchSongList);

    const player = document.getElementById("player")
    player.addEventListener('ended', () => {
        curSongIndex = currentQueue.indexOf(currentPlayingSong)
        curSongIndex ++
        playSong(currentQueue[curSongIndex])
    })
    player.addEventListener('loadedmetadata', () => {
        currentSongDuration = player.duration
    })

});

async function load_and_create_queue() {

    document.getElementById("song-list").innerHTML = null
    url = `http://localhost:8000/songs`
    
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json()
        queue = data

        for (let song in queue) {
            const htmlContent = `
                <div class="song-tab">
                    <button onClick=playSong(${song})>${queue[song]}</button>
                </div>
            `
            document.getElementById("song-list").innerHTML += htmlContent
            normalQueue.push(parseInt(song))
        }
        currentQueue = normalQueue
        let song = currentQueue[curSongIndex]
        let song_query = encodeURIComponent(queue[song])
        currentPlayingSong = song
        try{
            player.src = `http://localhost:8000/play?song=${song_query}`
        } catch {
            console.log(error)
        }
        setPlayerControls()
    } catch (error) {
        console.log(error)
    }
}

async function fetchSongList () {
    document.getElementById("song-list").innerHTML = null

    const query = document.getElementById('song-search').value;
    var url;

    if (!query){
        for (let song in queue) {
            const htmlContent = `
                <div class="song-tab">
                    <button onClick=playSong(${song})>${queue[song]}</button>
                </div>
            `
            document.getElementById("song-list").innerHTML += htmlContent
        }
    }
    else {
        for (let song in queue) {
            if (queue[song].toLowerCase().includes(query)) {
                const htmlContent = `
                    <div class="song-tab">
                        <button onClick=playSong(${song})>${queue[song]}</button>
                    </div>
                `
                document.getElementById("song-list").innerHTML += htmlContent
            }
        }
    }
}

async function setPlayerControls() {
    audioPlay = setInterval(function() {
        let audioTime = Math.round(player.currentTime);
        let audioLength = Math.round(player.duration)
        time.style.width = (audioTime * 100) / audioLength + '%';
    }, 1)
    currentSong.innerHTML = queue[currentPlayingSong]
}

async function playSong(song) {
    currentPlayingSong = song
    const song_name = queue[song]
    let song_query = encodeURIComponent(song_name)
    try{
        player.src = `http://localhost:8000/play?song=${song_query}`
    } catch {
        console.log(error)
    }

    player.load()
    setPlayerControls()
    player.play()
}