// 지역별 영상 목록
let videos = {
    "용인": ["ZgPjkSKD7WA", "qRdpwpHaN9k"],
    "인천": ["-_YndV1RjRc"],
    "동탄": ["058QwG7IRe8"],
    "아산": ["3G4s16NXNKQ"],
    "시흥": ["058QwG7IRe8"],
    "세종": ["MguH4CskJ6M"],
    "광주": [],
    "창원": ["TjNrSYBo5zg"]
};

// 첫 썸네일 불러오기
function getThumb(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

// 홈 그리드 생성
function loadHome() {
    const home = document.getElementById("homeGrid");
    home.innerHTML = "";

    Object.keys(videos).forEach(region => {
        const first = videos[region][0];
        const thumb = first ? getThumb(first) : "default_dino.png";

        home.innerHTML += `
            <div class="thumbnail-box" onclick="openRegion('${region}')">
                <img src="${thumb}">
                <div class="region-name">${region}</div>
            </div>
        `;
    });
}

loadHome();


// 목록 화면
function openRegion(region) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");

    document.getElementById("regionTitle").innerText = region;
    const box = document.getElementById("videoContainer");
    box.innerHTML = "";

    videos[region].forEach(id => {
        box.innerHTML += `<img src="${getThumb(id)}" onclick="playVideo('${id}')">`;
    });
}

function goHome() {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("settingsScreen").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}


// 🎬 YouTube Player
let player;

function playVideo(id) {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player("player", {
        videoId: id
    });
}

function restartVideo() {
    if (player) player.seekTo(0);
}

function togglePlay() {
    if (!player) return;
    const state = player.getPlayerState();

    if (state === 1) player.pauseVideo();
    else player.playVideo();
}

function pauseVideo() {
    if (player) player.pauseVideo();
}

function closePlayer() {
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");
}


// 설정 화면 (추가/삭제/수정)
function openSettings() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("settingsScreen").classList.remove("hidden");

    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        let list = videos[region]
            .map(id => `<input value="https://youtu.be/${id}" data-region="${region}" class="urlInput">`)
            .join("");

        container.innerHTML += `
            <div class="setting-group">
                <h3>${region}</h3>
                ${list}
                <button onclick="addUrl('${region}')">+ 영상 추가</button>
            </div>
        `;
    });
}

function addUrl(region) {
    const id = prompt("YouTube URL 입력");
    if (!id) return;

    const videoId = extractID(id);
    videos[region].push(videoId);
    openSettings();
    loadHome();
}

function extractID(url) {
    return url.split("v=")[1] || url.split("/").pop();
}
