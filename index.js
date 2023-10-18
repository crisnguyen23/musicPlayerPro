const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Cris_player';

const audio = $('#audio');
const playList = $('.playlist');
const switchTheme = $('.switchtheme');
const cd = $('.dashboard__cd');
const cdThumb = $('.dashboard__cd-thumb');
const cdName = $('.dashboard__songname');
const timeLeft = $('.time-left');
const timeRight = $('.time-right');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const backBtn = $('.btn-back');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const heartBtn = $('.btn-heart');
const volumeBtn = $('.btn-volume');
const muteVolumeBtn = $('.btn-volume-mute');
const lowVolumeBtn = $('.btn-volume-low');
const highVolumeBtn = $('.btn-volume-high');
const volumeBar = $('.volume-bar');

const app = {
    isMuteVolume: false,
    isLowVolume: false,
    currentIndex: 0, //first-index of list songs
    isLightTheme: false,
    isPlaying: false,
    //load infro from json local storage
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
        isRepeat: false,
        isRandom: false,
        isHeart: false,
        currentVolume: 1,
        savedVolume: 1,
    },
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Lac Troi Remix',
            singer: 'Mono x MTP',
            path: './assets/music/waiitingforYou.mp3',
            image: './assets/img/lactroi.png',
        },
        {
            name: 'Sống cho hết đời thanh xuân 4',
            singer: 'Dick x Ngắn',
            path: './assets/music/songChoHetDoiThanhXuan.mp3',
            image: './assets/img/songchohetdoithanhxuan.png',
        },
        {
            name: 'Khi cơn mưa dần phai',
            singer: 'Tez x Myra Trần',
            path: './assets/music/khiConMuaDanPhai.mp3',
            image: './assets/img/khiConMuaDanPhai.png',
        },
        {
            name: 'Truy Lùng Bảo Vật',
            singer: '24K.Right x Sofia',
            path: './assets/music/TruyLungBaoVat.mp3',
            image: './assets/img/truyLungBaoVat.png',
        },
        {
            name: 'Rolling Down',
            singer: 'Captain',
            path: './assets/music/rollingdown.mp3',
            image: './assets/img/Captain.png',
        },
        {
            name: 'Thanh âm miền núi',
            singer: 'Double2T x Thảo My',
            path: './assets/music/thanhAmMienNui.mp3',
            image: './assets/img/ThanhAmmiennui.png',
        },
        {
            name: 'Khóc cùng em',
            singer: 'Mr.Siro',
            path: './assets/music/khocCungEm.mp3',
            image: './assets/img/khoccungem.png',
        },
        {
            name: 'Để em rời xa',
            singer: 'FBoiz',
            path: './assets/music/DeEmRoiXaFBoiz.mp3',
            image: './assets/img/DeEmRoiXa.png',
        },
        {
            name: 'Ngôi nhà hạnh phúc  ',
            singer: 'Trung Quân',
            path: './assets/music/ngoiNhaHanhPhuc.mp3',
            image: './assets/img/NgoinhaHanhPhuc.png',
        },
        {
            name: 'Cô đơn trên Sofa',
            singer: 'Trung Quân',
            path: './assets/music/coDonTrenSofaTrungQuan.mp3',
            image: './assets/img/CoDontrenSofa.png',
        },
    ],

    render() {
        const htmls = this.songs.map((song, index) => {
            return ` 
        <div class="song ${index === this.currentIndex ? 'songplaying' : ''}" index="${index}">
            <div>
                <img class="song__thumb" src="${song.image}" alt="" />
                </div>
                <div class="song__body">
                    <h3 class="title">${song.name}</h3>
                    <div class="author">${song.singer}</div>
                </div>
                <i class="fa-solid fa-ellipsis option-btn"></i>
             </div>`;
        });
        playList.innerHTML = htmls.join('');
    },

    defineProperties() {
        // Add key currentSong vao object app: currentSong: get(){}
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents() {
        //Switch theme when click
        switchTheme.onclick = () => {
            this.isLightTheme = !this.isLightTheme;
            switchTheme.classList.toggle('light', this.isLightTheme);
        };

        //Zoomin-out CD thumb when scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //Handle CD rotate //need learn more animate API
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, //10s 1 period
            iteration: Infinity,
        });
        cdThumbAnimate.pause();

        // Click play
        const playBtn = $('.btn-togger-play');
        playBtn.onclick = () => {
            //arrow function do not create closure => still use this
            this.isPlaying ? audio.pause() : audio.play();
        };

        //when audio playing/pause
        audio.onplay = () => {
            this.isPlaying = true;
            playBtn.classList.add('playing');
            cdThumbAnimate.play();
        };
        audio.onpause = () => {
            this.isPlaying = false;
            playBtn.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        //When audiotime change
        audio.ontimeupdate = () => {
            //when dont load audio: audio.duration = NaN
            if (audio.duration) {
                timeLeft.textContent = this.formatTime(audio.currentTime);
                // const remainTime = this.formatTime(audio.duration) - audio.currentTime;  `-${remainTime}`
                timeRight.textContent = this.formatTime(audio.duration);

                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
                progress.style.background = `linear-gradient(to right, rgb(147, 113, 243) ${progressPercent}%, rgb(214, 214, 214) ${progressPercent}%)`;
            }
        };

        //Handle seeking audio
        progress.oninput = (e) => {
            const seekingTime = audio.duration * (e.target.value / 100);
            audio.currentTime = Math.floor(seekingTime);
            this.isPlaying ? audio.play() : audio.pause();
        };

        //Handle volume Adjust area
        highVolumeBtn.onclick = () => {
            this.setConfig('savedVolume', audio.volume);
            audio.volume = 0;
            this.renderVolume();
        };
        lowVolumeBtn.onclick = () => {
            this.setConfig('savedVolume', audio.volume);
            audio.volume = 0;
            this.renderVolume();
        };
        muteVolumeBtn.onclick = () => {
            audio.volume = this.config.savedVolume;
            this.renderVolume();
        };

        volumeBar.onclick = (e) => {
            e.stopPropagation();
        };

        //Handle volume bar
        volumeBar.oninput = (e) => {
            audio.volume = e.target.value / 100;
            this.setConfig('currentVolume', audio.volume);
            this.renderVolume();
        };

        //---in mobile:touch divice
        let isTouchingVolume = false;
        volumeBar.ontouchstart = () => {
            isTouchingVolume = true;
        };

        document.ontouchmove = (e) => {
            if (isTouchingVolume) {
                e.preventDefault(); // stop scroll when touch move adjust mobile
            }
        };
        document.ontouchend = (e) => {
            isTouchingVolume = false;
        };
        // -------------------
        //Next/Back/random/rotate song
        nextBtn.onclick = () => {
            if (this.isRandom) {
                this.randomSong();
            } else {
                this.nextSong();
            }
            audio.play();
            this.scrolltoAciveSong();
            this.render();
        };
        backBtn.onclick = () => {
            if (audio.currentTime < 6) {
                if (this.isRandom) {
                    this.randomSong();
                } else {
                    this.backSong();
                }
            } else {
                audio.currentTime = 0;
            }
            audio.play();
            this.scrolltoAciveSong();
            this.render();
        };
        randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            this.setConfig('isRandom', this.isRandom);
            randomBtn.classList.toggle('active', this.isRandom);
        };
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat);
            repeatBtn.classList.toggle('active', this.isRepeat);
        };
        heartBtn.onclick = () => {
            this.isHeart = !this.isHeart;
            this.setConfig('isHeart', this.isHeart);
            heartBtn.classList.toggle('active', this.isHeart);
        };

        //Handle nextsong when audio.end
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        //active when click to song (throught dedicated from parent)
        playList.onclick = (e) => {
            const songClick = e.target.closest('.song:not(.songplaying)');
            if (songClick) {
                this.currentIndex = +songClick.getAttribute('index');
                this.loadCurrentSong();
                this.render();
                audio.play();
            }
        };
    },

    formatTime(time) {
        let minutes = Math.floor(time / 60);
        let timeForSeconds = time - minutes * 60; // seconds without counted minutes
        let seconds = Math.floor(timeForSeconds);
        let secondsReadable = seconds > 9 ? seconds : `0${seconds}`; // To change 2:2 into 2:02
        return `${minutes}:${secondsReadable}`;
    },

    loadCurrentSong() {
        cdName.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    //Control features of btn
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    backSong() {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    renderVolume() {
        switch (true) {
            case audio.volume <= 0:
                this.isLowVolume = false;
                this.isMuteVolume = true;
                break;
            case audio.volume < 0.4:
                this.isMuteVolume = false;
                this.isLowVolume = true;
                break;
            default:
                this.isLowVolume = false;
                this.isMuteVolume = false;
        }
        volumeBtn.classList.toggle('mute', this.isMuteVolume);
        volumeBtn.classList.toggle('low', this.isLowVolume);
        volumeBar.style.background = `linear-gradient(to right, rgb(147, 113, 243) ${
            audio.volume * 100
        }%, rgb(214, 214, 214) ${audio.volume * 100}%`;
        volumeBar.value = audio.volume * 100;
    },
    randomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrolltoAciveSong() {
        $('.song.songplaying').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.isHeart = this.config.isHeart;
        audio.volume = this.config.currentVolume;
    },

    start() {
        this.loadConfig();

        this.defineProperties();
        this.handleEvents();

        this.loadCurrentSong();
        this.render();

        //DIsplay inital staus
        this.renderVolume();
        heartBtn.classList.toggle('active', this.isHeart);
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },
};

app.start();
