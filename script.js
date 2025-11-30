// 지역별 영상 데이터 (설정에서 수정 가능)
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

/* ---------------- 홈 → 지역 선택 ---------------- */

function openRegion(region) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");

    document.getElementById("regionTitle").innerText = region;

    const container = document.getElementById("videoContainer");
    container.innerHTML = "";

    if (videos[region].length === 0) {
        container.innerHTML = "<p style='color:white;text-align:center;'>등록된 영상이 없습니다.</p>";
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
    document.getElementById("home").classList.remove("hidden");
}

/* ---------------- 영상 재생 ---------------- */

let player;

function playVideo(videoId) {
    document.getElementById("videoList").classList.add("hidden");
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player('player', {
        videoId: videoId
    });
}

function closePlayer() {
    document.getElementById("playerScreen").classList.add("hidden");
    document.getElementById("videoList").classList.remove("hidden");
    if (player) player.destroy();
}

/* ---------------- 설정 화면 ---------------- */

function openSettings() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("settingsScreen").classList.remove("hidden");
    renderSettings();
}

function closeSettings() {
    document.getElementById("settingsScreen").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
}

function renderSettings() {
    const container = document.getElementById("settingsContainer");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        let html = `
            <div class="settings-box">
                <h3>${region}</h3>
        `;

        videos[region].forEach((id, index) => {
            html += `
                <input type="text" id="${region}_${index}" value="https://youtu.be/${id}">
            `;
        });

        html += `
            <button class="add-btn" onclick="addVideo('${region}')">+ 영상 추가</button>
            </div>
        `;

        container.innerHTML += html;
    });
}

function addVideo(region) {
    videos[region].push("");
    renderSettings();
}

function saveSettings() {
    Object.keys(videos).forEach(region => {
        const newList = [];
        let index = 0;

        while (document.getElementById(`${region}_${index}`)) {
            const url = document.getElementById(`${region}_${index}`).value.trim();
            if (url.includes("youtu")) {
                const id = extractVideoId(url);
                if (id) newList.push(id);
            }
            index++;
        }
        videos[region] = newList;
    });

    alert("저장되었습니다!");
}

/* URL에서 영상 ID 추출 */
function extractVideoId(url) {
    let id = url.split("youtu.be/")[1];
    if (!id) id = url.split("v=")[1];
    if (id && id.includes("&")) id = id.split("&")[0];
    return id;
}

/* YouTube API */
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
