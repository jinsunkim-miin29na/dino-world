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
// localStorage에서 저장된 값 불러오기 (깨져 있으면 기본값 사용)
// ------------------------
let videos;

try {
    const saved = JSON.parse(localStorage.getItem("videos"));
    if (saved && typeof saved === "object") {
        videos = saved;
    } else {
        videos = JSON.parse(JSON.stringify(defaultVideos)); // 깊은 복사
    }
} catch (e) {
    videos = JSON.parse(JSON.stringify(defaultVideos));
}

// ------------------------
// 홈 화면 썸네일 표시
// ------------------------
function loadHome() {
    const homeGrid = document.getElementById("homeGrid");
    if (!homeGrid) return;

    homeGrid.innerHTML = "";

    Object.keys(videos).forEach(region => {
        const first = videos[region] && videos[region][0];
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
    const screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.add("hidden"));
}

function goHome() {
    hideScreens();
    const home = document.getElementById("home");
    if (home) home.classList.remove("hidden");
}

// ------------------------
// 재생 목록 화면
// ------------------------
function openRegion(region) {
    hideScreens();

    const listScreen = document.getElementById("videoList");
    const titleEl = document.getElementById("regionTitle");
    const container = document.getElementById("videoContainer");

    if (!listScreen || !titleEl || !container) return;

    listScreen.classList.remove("hidden");
    titleEl.innerText = region;
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

    const playerScreen = document.getElementById("playerScreen");
    if (!playerScreen) return;
    playerScreen.classList.remove("hidden");

    if (player) {
        try { player.destroy(); } catch (e) {}
    }

    player = new YT.Player("player", {
    videoId: videoId,
    playerVars: {
        controls: 0,        // 유튜브 기본 컨트롤 숨김
        modestbranding: 1,  // 유튜브 로고 최소화
        rel: 0,             // 관련영상 노출 금지
        showinfo: 0,        // 제목 표시 금지
        fs: 0,              // 전체화면 버튼 숨김
        disablekb: 1,       // 키보드 조작 비활성화
        iv_load_policy: 3,  // 정보카드 숨김
        playsinline: 1      // iOS 전체화면 강제 방지
    },
    events: {}
});

}

function replay() {
    if (player && player.seekTo) player.seekTo(0);
}
function pauseVideo() {
    if (player && player.pauseVideo) player.pauseVideo();
}
function playVideoAgain() {
    if (player && player.playVideo) player.playVideo();
}

function backToList() {
    hideScreens();

    const listScreen = document.getElementById("videoList");
    if (listScreen) listScreen.classList.remove("hidden");

    if (player) {
        try { player.destroy(); } catch (e) {}
        player = null;
    }
}

// ------------------------
// 설정 화면 열기 / 닫기
// ------------------------
function openSettings() {
    hideScreens();

    const settingsScreen = document.getElementById("settingsScreen");
    const container = document.getElementById("settingsContainer");
    if (!settingsScreen || !container) return;

    settingsScreen.classList.remove("hidden");
    container.innerHTML = "";

    Object.keys(videos).forEach(region => {
        container.innerHTML += buildRegionSetting(region);
    });
}

function closeSettings() {
    // 설정 창 닫고 홈으로
    goHome();
}

// ------------------------
// 설정 화면 UI 생성
// ------------------------
function buildRegionSetting(region) {
    let html = `
        <div class="setting-group">
            <h3>${region}</h3>
            <div class="urls" id="urls-${region}">
    `;

    (videos[region] || []).forEach((id, idx) => {
        const url = id ? `https://youtu.be/${id}` : "";
        html += `
            <div class="url-row">
                <input value="${url}">
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
    if (!videos[region]) videos[region] = [];
    videos[region].push("");

    openSettings(); // 다시 렌더링
}

function removeUrl(region, idx) {
    if (!videos[region]) return;
    videos[region].splice(idx, 1);

    openSettings(); // 다시 렌더링
}

// ------------------------
// 설정 - 저장
// ------------------------
function saveSettings() {
    Object.keys(videos).forEach(region => {
        const inputs = document.querySelectorAll(`#urls-${region} input`);
        const newList = [];

        inputs.forEach(input => {
            const url = input.value.trim();
            const id = extractId(url);
            if (id) newList.push(id);
        });

        videos[region] = newList;
    });

    try {
        localStorage.setItem("videos", JSON.stringify(videos));
    } catch (e) {
        // 저장 실패해도 앱은 동작하게 놔둠
    }

    alert("저장 완료!");
    loadHome();
    goHome();
}

// ------------------------
// 유튜브 URL → ID 추출
// ------------------------
function extractId(url) {
    if (!url) return null;

    let id = url.trim();

    // 1) youtu.be/ 형식
    const shortIdx = id.indexOf("youtu.be/");
    if (shortIdx !== -1) {
        id = id.substring(shortIdx + "youtu.be/".length);
    } else {
        // 2) v= 파라미터 형식
        const vIdx = id.indexOf("v=");
        if (vIdx !== -1) {
            id = id.substring(vIdx + 2);
        }
    }

    // 3) ?si=, &t= 같은 꼬리 제거
    const qIdx = id.indexOf("?");
    if (qIdx !== -1) id = id.substring(0, qIdx);
    const ampIdx = id.indexOf("&");
    if (ampIdx !== -1) id = id.substring(0, ampIdx);

    // 4) 이상한 문자 제거
    id = id.replace(/[^0-9A-Za-z_\-]/g, "");

    return id || null;
}

// ------------------------
// YouTube API 로딩
// ------------------------
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

/* --- 타임라인 업데이트 --- */
const seekBar = document.getElementById("seekBar");
let progressTimer = null;

function updateProgressBar() {
    if (!player || typeof player.getDuration !== "function") return;

    const duration = player.getDuration();
    const current = player.getCurrentTime();

    if (duration > 0) {
        seekBar.value = (current / duration) * 100;
    }
}

/* 재생 위치 드래그 이동 */
seekBar.addEventListener("input", () => {
    if (!player) return;
    const percent = seekBar.value;
    const duration = player.getDuration();
    player.seekTo((duration * percent) / 100);
});

/* 재생할 때 타이머 실행 */
function startProgressBar() {
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(updateProgressBar, 500);
}

/* player 생성 후 progress 시작 */
function playVideo(region, videoId) {
    hideScreens();
    document.getElementById("playerScreen").classList.remove("hidden");

    if (player) player.destroy();

    player = new YT.Player("player", {
        videoId: videoId,
        playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            disablekb: 1,
            iv_load_policy: 3,
            playsinline: 1
        },
        events: {
            onReady: startProgressBar
        }
    });
}

// 진짜 전체화면: 영상 iframe만 전체 화면으로
function enterFull() {
    const iframe = document.querySelector("#player iframe");
    if (iframe.requestFullscreen) iframe.requestFullscreen();
}

// 전체화면 종료
function exitFull() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

