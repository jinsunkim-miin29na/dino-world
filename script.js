// 지역별 영상 목록 (초기값)
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

// 저장된 설정 불러오기
if (localStorage.getItem("dinoVideos")) {
    videos = JSON.parse(localStorage.getItem("dinoVideos"));
}

function saveVideos() {
    localStorage.setItem("dinoVideos", JSON.stringify(videos));
}

// 홈 → 지역 목록
function openRegion(region) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");

    document.getElementById("regionTitle").innerText = region;

    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (videos[region].length === 0) {
        container.innerHTML = "<p style='color:white;'>등록된 영상이 없습니다.</p>";
        return;
    }

    videos[region].forEach(id => {
        const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
        container.innerHTML += `
            <img class="videoThumb" src="${thumb}" onclick="playVideo('${id}')">
        `;
    });
}

function goHome() {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}

// 재생
let player;

function playVideo(videoId) {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player('player', {
        videoId: videoId,
        events: {}
    });
}

function closePlayer() {
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");
    if (player) player.destroy();
}

// 설정 화면
function openSettings() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("settings").classList.remove("hidden");

    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        let card = `
            <div class="setting-card">
                <h3>${region}</h3>
        `;

        videos[region].forEach((id, index) => {
            card += `
                <div>
                    <input type="text" value="https://youtu.be/${id}" 
                           onchange="updateVideo('${region}', ${index}, this.value)">
                </div>
            `;
        });

        card += `
            <button class="add-btn" onclick="addVideo('${region}')">+ 영상 추가</button>
            </div>
        `;

        container.innerHTML += card;
    });
}

function updateVideo(region, index, url) {
    const id = extractId(url);
    videos[region][index] = id;
    saveVideos();
}

function addVideo(region) {
    videos[region].push("");
    saveVideos();
    openSettings();
}

function extractId(url) {
    return url.replace("https://youtu.be/", "").split("?")[0].trim();
}

function closeSettings() {
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}

// YouTube API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
