// 지역별 영상 목록
const videos = {
    "용인": [
        "ZgPjkSKD7WA",
        "qRdpwpHaN9k"
    ],
    "인천": [
        "-_YndV1RjRc"
    ],
    "동탄": [
        "058QwG7IRe8"
    ],
    "아산": [
        "3G4s16NXNKQ"
    ],
    "시흥": [
        "058QwG7IRe8"
    ],
    "세종": [
        "MguH4CskJ6M"
    ],
    "광주": [],
    "창원": [
        "TjNrSYBo5zg"
    ]
};


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
    document.getElementById("home").classList.remove("hidden");
}

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


// YouTube API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
