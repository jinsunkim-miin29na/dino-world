// ------------------------
// 🔥 영상 데이터 초기화 금지!
// ------------------------
// localStorage.removeItem("videos");   ← 절대 사용 금지!!

// ------------------------
// 기본 영상 목록
// ------------------------
const defaultVideos = {
    "용인": ["ZgPjkSKD7WA", "qRdpwpHaN9k"],
    "인천": ["-_YndV1RjRc"],
    "동탄": ["uueASoGmhoc"],
    "아산": ["3G4s16NXNKQ"],
    "시흥": ["058QwG7IRe8"],
    "세종": ["MguH4CskJ6M"],
    "광주": [],
    "창원": ["TjNrSYBo5zg"]
};

// ------------------------
// 로컬 저장 불러오기
// ------------------------
let saved;

try {
    saved = JSON.parse(localStorage.getItem("videos"));
} catch (e) {
    saved = null;
}

let videos = saved && typeof saved === "object"
    ? saved
    : structuredClone(defaultVideos);

// ------------------------
// 홈 화면 로딩
// ------------------------
function loadHome() {
    const homeGrid = document.getElementById("homeGrid");
    homeGrid.innerHTML = "";

    Object.keys(videos).forEach(region => {
        const first = videos[region][0];
        const thumb = first
            ? `https://img.youtube.com/vi/${first}/mqdefault.jpg`
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

// ------------------------
// 화면 전환 공통
// ------------------------
function hideScreens() {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
}

function goHome() {
    hideScreens();
    document.getElementById("home").classList.remove("hidden");
}

// ------------------------
// 재생 목록 화면
// ------------------------
function openRegion(region) {
    hideScreens();
    document.getElementById("videoList").classList.remove("hidden");

    document.getElementById("regionTitle").innerText = region;

    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (!videos[region] || videos[region].length === 0) {
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

// ------------------------
// YouTube 플레이어
// ------------------------
let player = null;

function playVideo(region, videoId) {
    hideScreens();
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player("player", {
        videoId: videoId
    });
}

function replay() {
    if (player) player.seekTo(0);
}
function pauseVideo() {
    if (player) player.pauseVideo();
}
function playVideoAgain() {
    if (player) player.playVideo();
}

function backToList() {
    hideScreens();
    document.getElementById("videoList").classList.remove("hidden");
    if (player) player.destroy();
}

// ------------------------
// 설정 화면
// ------------------------
function openSettings() {
    hideScreens();
    document.getElementById("settingsScreen").classList.remove("hidden");

    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        container.innerHTML += buildRegionSetting(region);
    });
}

function closeSettings() {
    goHome();
}

// ------------------------
// 설정화면 UI 생성
// ------------------------
function buildRegionSetting(region) {
    let html = `
        <div class="setting-group">
            <h3>${region}</h3>
            <div class="urls" id="urls-${region}">
    `;

    videos[region].forEach((id, idx) => {
        html += `
            <div class="url-row">
                <input value="https://youtu.be/${id}">
                <button class="remove-btn" onclick="removeUrl('${region}', ${idx})">X</button>
            </div>
        `;
    });

    html += `
            </div>
            <button class="add-btn" onclick="addUrl('${region}')">+ 영상 추가</button>
        </div>
    `;

    return html;
}

// ------------------------
// 설정 - 추가 / 삭제
// ------------------------
function addUrl(region) {
    videos[region].push("");
    openSettings();
}

function removeUrl(region, idx) {
    videos[region].splice(idx, 1);
    openSettings();
}

// ------------------------
// 설정 - 저장
// ------------------------
function saveSettings() {
    Object.keys(videos).forEach(region => {
        const inputs = document.querySelectorAll(`#urls-${region} input`);
        const newList = [];

        inputs.forEach(input => {
            let url = input.value.trim();
            let id = extractId(url);
            if (id) newList.push(id);
        });

        videos[region] = newList;
    });

    localStorage.setItem("videos", JSON.stringify(videos));
    alert("저장 완료!");

    loadHome();
    goHome();
}

// ------------------------
// 유튜브 URL → ID 정제
// ------------------------
function extractId(url) {
    if (!url) return null;

    let id = url;

    if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1];
    } else if (url.includes("v=")) {
        id = url.split("v=")[1];
    }

    // 뒤에 붙은 ?si=, &t= 같은 파라미터 제거
    id = id.split("?")[0].split("&")[0];

    // 이상한 문자 제거
    id = id.replace(/[^0-9A-Za-z_-]/g, "");

    return id || null;
}

// ------------------------
// YouTube API 로딩
// ------------------------
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
