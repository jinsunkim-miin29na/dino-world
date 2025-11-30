// 기본 영상 목록
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

// 저장된 내용 불러오기
if (localStorage.getItem("videos")) {
    videos = JSON.parse(localStorage.getItem("videos"));
}


/* -------------------------
   지역 화면
------------------------- */
function openRegion(region) {
    document.getElementById("home").classList.add("hidden");
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
            <img src="${thumb}" onclick="playVideo('${id}')">
        `;
    });
}

function goHome() {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("settingsScreen").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}


/* -------------------------
   Player
------------------------- */

let player;

function playVideo(id) {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player('player', {
        videoId: id,
        events: {}
    });
}

function closePlayer() {
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");
    if (player) player.destroy();
}

/* -------------------------
   설정 화면
------------------------- */

function openSettings() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("settingsScreen").classList.remove("hidden");

    renderSettings();
}

function closeSettings() {
    document.getElementById("settingsScreen").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}


// 설정 UI 렌더링
function renderSettings() {
    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        const card = document.createElement("div");
        card.className = "settings-card";

        let html = `<h3>${region}</h3>`;

        videos[region].forEach((id, index) => {
            html += `
                <div class="url-line">
                    <input value="https://youtu.be/${id}" 
                           onchange="updateVideoURL('${region}', ${index}, this.value)">
                    <button onclick="removeVideo('${region}', ${index})">삭제</button>
                </div>
            `;
        });

        html += `
            <button class="add-btn" onclick="addVideo('${region}')">+ 영상 추가</button>
        `;

        card.innerHTML = html;
        container.appendChild(card);
    });
}

/* 기능 함수 */

function extractId(url) {
    return url.replace("https://youtu.be/", "")
              .replace("https://youtube.com/watch?v=", "")
              .replace("https://www.youtube.com/watch?v=", "")
              .trim();
}

function addVideo(region) {
    videos[region].push("");
    renderSettings();
}

function removeVideo(region, index) {
    videos[region].splice(index, 1);
    renderSettings();
}

function updateVideoURL(region, index, url) {
    const id = extractId(url);
    videos[region][index] = id;
}

// 저장
function saveSettings() {
    localStorage.setItem("videos", JSON.stringify(videos));
    alert("저장 완료!");
}

// YouTube API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
