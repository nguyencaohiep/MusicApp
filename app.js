const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd') 
const nameSong = $('.info h3')
const singer = $('.info p')
const audio = $('#audio')
const playBtn = $('.control .toggle')
const iconPlay = playBtn.querySelector('i')
const percentProgress = $('#percent')
const nextBtn = $('.control .next')
const preBtn = $('.control .pre')
const loopBtn = $('.options .loop')
const randomBtn = $('.options .random')
var audioStatus = false

const app = {
      currentIndex: 0,
      songs: [
            {
                  name: 'I will go to you like first snow',
                  singer: 'Ailee',
                  path: './assets/music/song1.mp3',
                  time: '03:49'
            },
            {
                  name: 'Meeting him among them',
                  singer: 'Lee Sun Hee',
                  path: './assets/music/song2.mp3',
                  time: '03:45'
            },
            {
                  name: 'Hương Mai Như Xưa',
                  singer: 'Mao Bất Dịch',
                  path: './assets/music/song3.mp3',
                  time: '04:00'
            },
            {
                  name: 'Trầm Hương Lưu Niên',
                  singer: 'Lôi Giai',
                  path: './assets/music/song4.mp3',
                  time: '02:05'
            },
            {
                  name: 'Đồng thoại',
                  singer: 'Quang Lương',
                  path: './assets/music/song5.mp3',
                  time: '04:05'
            },
            {
                  name: 'Những Năm Tháng Ấy',
                  singer: 'Hồ Hạ',
                  path: './assets/music/song6.mp3',
                  time: '06:13'
            },
            {
                  name: 'You are my everything',
                  singer: 'Gummy',
                  path: './assets/music/song7.mp3',
                  time: '04:00'
            },
            {
                  name: 'Họa Tình',
                  singer: 'Diệu Bội Na',
                  path: './assets/music/song8.mp3',
                  time: '05:13'
            },
            {
                  name: 'Galaxy',
                  singer: 'Bolbbalgan4',
                  path: './assets/music/song9.mp3',
                  time: '03:33'
            },
            {
                  name: 'Marry you',
                  singer: 'The Glee Cast',
                  path: './assets/music/song10.mp3',
                  time: '03:46'
            }
      ],

      render: function() {
            const htmls = this.songs.map(song =>{
                  return `
                        <div class="field_song">
                              <div class="details">
                                    <h3 class="song_name">${song.name}</h3>
                                    <p class="singer">${song.singer}</p>
                              </div>
                              <div class="time">
                                    <p id="timer">${song.time}</p>
                              </div>
                        </div>
                  `
            })
            $('.song_playList').innerHTML = htmls.join('')
      },

      defineProperties: function() {
            Object.defineProperty(this, 'currentSong',{
                  get: function() {
                        return this.songs[this.currentIndex]
                  }
            })
      },

      handleEvents: function(){
            const cdWidth = cd.offsetWidth
            const [minutes, second] = this.currentSong.time.split(":")
            const timeSong = (+minutes) * 60 + (+second) // + => convert string to number
            const list = $$('.song_playList .field_song')
            const dashBoard = $('.dashboard')
            const footerHeight = $('.footer').offsetHeight

            var isLoop = false

            // phóng to / thu nhỏ cd-thumb
            document.onscroll = function() {
                  const scrollTop = window.scrollY || document.documentElement.scrollTop
                  const newCdWidth = cdWidth - scrollTop
                  const songList = $('.song_playList')
                  var size = newCdWidth > 0 ? newCdWidth + 'px' : 0

                  cd.style.width = size
                  cd.style.height = size
                  cd.style.opacity = newCdWidth / cdWidth
                  console.log(window.getComputedStyle(songList, null).getPropertyValue("margin-top"))
            }

            // cd-thumb rotate
            const cd_thumb = $('.cd .cd-thumb')
            const cdThumbAnimate = cd_thumb.animate([
                  {
                        transform: 'rotate(360deg)'
                  }
            ], {
                  duration: timeSong * 1000,
            })
            cdThumbAnimate.pause()

            // play or pause music
            playBtn.onclick = function(){
                  audio.paused ? audio.play() : audio.pause()

                  audio.onplay = function(){
                        iconPlay.classList.remove('fa-caret-right')
                        iconPlay.classList.add('fa-pause')
                        cdThumbAnimate.play()
                  }

                  audio.onpause = function(){
                        iconPlay.classList.remove('fa-pause')
                        iconPlay.classList.add('fa-caret-right')
                        cdThumbAnimate.pause()
                  }

                  audio.ontimeupdate = function(){
                        if(audio.duration){
                              percentProgress.value = audio.currentTime / audio.duration * 100
                        }
                  }  
            }

            audio.onended = function(){
                  if(isLoop){
                        setTimeout(audio.play(), 5000)
                  }
                  else{
                        setTimeout(function(){
                              nextBtn.click()
                              audio.play()
                        }, 5000)
                  }
            }

            // seek : tua 
            percentProgress.onclick = function(e){
                  var seekPercent = e.target.value 
                  audio.currentTime = seekPercent * audio.duration / 100
            }

            // next song
            nextBtn.onclick = function(){
                  app.nextSong()
                  cdThumbAnimate.pause()
                  app.reloadStatus()
                  list.forEach((e) => {
                        e.classList.remove('active')
                  })
                  list[app.currentIndex].classList.add('active')
                  app.scrollSongIntoView()
            }

            // previous song
            preBtn.onclick = function(){
                  app.reloadStatus()
                  cdThumbAnimate.pause()
                  app.previousSong()
                  list.forEach((e) => {
                        e.classList.remove('active')
                  })
                  list[app.currentIndex].classList.add('active')
                  app.scrollSongIntoView()
            }            
            
            // loop song 
            loopBtn.onclick = function(){
                  isLoop =! isLoop
                  if(isLoop){
                        this.style.color = '#ec7803'
                  }
                  else{
                        this.style.color = 'rgba(255, 255, 255, 0.5)'
                  }
            }

            // random song 
            randomBtn.onclick = function(){
                  var tmp = Math.floor(Math.random() * app.songs.length)
                  while(app.currentIndex === tmp){
                        tmp = Math.floor(Math.random() * app.songs.length)
                  }
                  app.currentIndex = tmp
                  app.loadCurrentSong()
                  iconPlay.classList.remove('fa-pause')
                  iconPlay.classList.add('fa-caret-right')
                  percentProgress.value = 0
                  cdThumbAnimate.pause()
                  list.forEach((e) => {
                        e.classList.remove('active')
                  })
                  list[app.currentIndex].classList.add('active')
                  app.scrollSongIntoView()
            }

            // handle event on play list
            list[0].classList.add('active')
            list.forEach((e, index) => {
                  e.addEventListener("click", function(){
                        list.forEach((e) => {
                              e.classList.remove('active')
                              this.classList.add('active')
                        })
                        app.currentIndex = index 
                        app.loadCurrentSong()
                        iconPlay.classList.remove('fa-pause')
                        iconPlay.classList.add('fa-caret-right')
                        percentProgress.value = 0
                  })
            })
      },

      // load current song
      loadCurrentSong: function(){
            nameSong.textContent = this.currentSong.name
            singer.textContent = this.currentSong.singer
            audio.src = this.currentSong.path
      },

      // next song
      nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                  this.currentIndex = 0
            }
            this.loadCurrentSong()
      },

      // previous song
      previousSong: function(){
            this.currentIndex--
            if(this.currentIndex < 0){
                  this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
      },

      // reload status for button play, percent progress
      reloadStatus: function(){
            // button play 
            iconPlay.classList.remove('fa-pause')
            iconPlay.classList.add('fa-caret-right')

            // progress comeback start position
            percentProgress.value = 0
      },

      scrollSongIntoView: function() {
            setTimeout(() => {
                  $('.field_song.active').scrollIntoView({
                        behaivor: 'smooth',
                        block: 'center'
                  })
            }, 300)
      },

      start: function(){
            this.render()
            this.defineProperties()
            this.handleEvents()
            this.loadCurrentSong()
      }
}

app.start()