// 지역별 영상 목록 (설정에서 저장되면 localStorage 로 대체)
let videos = JSON.parse(localStorage.getItem("videos")) || {
    "용인": ["ZgPjkSKD7WA", "qRdpwpHaN9k"],
    "인천": ["-_YndV1RjRc"],
    "동탄": ["058QwG7IRe8"],
    "아산": ["3G4s16NXNKQ"],
    "시흥": ["058QwG7IRe8"],
    "세종": ["MguH4CskJ6M"],
    "광주": [],
    "창원": ["TjNrSYBo5zg"]
};

// 홈 화면 썸네일 표시
function loadHome() {
    const homeGrid = document.getElementById("homeGrid");
    homeGrid.innerHTML = "";

    Object.keys(videos).forEach(region => {
        const first = videos[region][0];
        const thumb = first ? `https://img.youtube.com/vi/${first}/mqdefault.jpg`
                             : "default_dino.png";

        homeGrid.innerHTML += `
            <div class="thumbnail-box" onclick="openRegion('${region}')">
                <img src="${thumb}">
                <div class="label">${region}</div>
            </div>
        `;
    });
}

loadHome();

// 화면 이동
function goHome() {
    hideScreens();
    document.getElementById("home").classList.remove("hidden");
}

function hideScreens() {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
}

// 영상 목록 화면
function openRegion(region) {
    hideScreens();
    document.getElementById("videoList").classList.remove("hidden");

    document.getElementById("regionTitle").innerText = region;

    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (videos[region].length === 0) {
        container.innerHTML = "<p>등록된 영상이 없습니다.</p>";
        return;
    }

    videos[region].forEach(id => {
        const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
        container.innerHTML += `
            <img src="${thumb}" onclick="playVideo('${region}', '${id}')">
        `;
    });
}

// YouTube 플레이어 호출
let player;

function playVideo(region, videoId) {
    hideScreens();
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player('player', {
        videoId: videoId,
        events: {}
    });
}

// 플레이어 기능
function replay() { if (player) player.seekTo(0); }
function pauseVideo() { if (player) player.pauseVideo(); }
function playVideoAgain() { if (player) player.playVideo(); }

function backToList() {
    hideScreens();
    document.getElementById("videoList").classList.remove("hidden");
    if (player) player.destroy();
}

// 설정 화면 열기
function openSettings() {
    hideScreens();
    document.getElementById("settingsScreen").classList.remove("hidden");

    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        container.innerHTML += buildRegionSetting(region);
    });
}

function buildRegionSetting(region) {
    let html = `
        <div class="setting-group">
            <h3>${region}</h3>
            <div class="urls" id="urls-${region}">
    `;

    videos[region].forEach((id, idx) => {
        html += `
            <div class="url-row">
                <input value="https://youtu.be/${id}" id="${region}-${idx}">
                <button class="remove-btn" onclick="removeUrl('${region}', ${idx})">X</button>
            </div>`;
    });

    html += `
            </div>
            <button class="add-btn" onclick="addUrl('${region}')">+ 영상 추가</button>
        </div>
    `;

    return html;
}

// 설정 기능
function addUrl(region) {
    videos[region].push("");
    openSettings();
}

function removeUrl(region, idx) {
    videos[region].splice(idx, 1);
    openSettings();
}

function saveSettings() {
    Object.keys(videos).forEach(region => {
        const rows = document.querySelectorAll(`#urls-${region} .url-row input`);
        videos[region] = [];

        rows.forEach(r => {
            const url = r.value.trim();
            if (url.includes("youtu")) {
                const id = extractId(url);
                if (id) videos[region].push(id);
            }
        });
    });

    localStorage.setItem("videos", JSON.stringify(videos));
    alert("저장 완료!");
    loadHome();
    goHome();
}

function extractId(url) {
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
    if (url.includes("v=")) return url.split("v=")[1];
    return "";
}

// YouTube API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
