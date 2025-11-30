// 8개 지역
const regions = [
  "용인",
  "인천",
  "동탄",
  "아산",
  "시흥",
  "세종",
  "광주",
  "창원",
];

// 지역별 예시 영상 (나중에 유튜브ID만 바꿔 끼우면 됨)
const regionVideos = {
  용인: [
    { title: "용인 공룡쇼 1", id: "dQw4w9WgXcQ" },
    { title: "용인 공룡쇼 2", id: "oHg5SJYRHA0" },
  ],
  인천: [
    { title: "인천 공룡쇼 1", id: "KxJjSxGZ-ew" },
    { title: "인천 공룡쇼 2", id: "L_jWHffIx5E" },
  ],
  동탄: [
    { title: "동탄 공룡쇼 1", id: "6_b7RDuLwcI" },
    { title: "동탄 공룡쇼 2", id: "UIBHRFQ8YFY" },
  ],
  아산: [
    { title: "아산 공룡쇼 1", id: "4NRXx6U8ABQ" },
    { title: "아산 공룡쇼 2", id: "dQw4w9WgXcQ" },
  ],
  시흥: [
    { title: "시흥 공룡쇼 1", id: "L_jWHffIx5E" },
    { title: "시흥 공룡쇼 2", id: "6_b7RDuLwcI" },
  ],
  세종: [
    { title: "세종 공룡쇼 1", id: "oHg5SJYRHA0" },
    { title: "세종 공룡쇼 2", id: "UIBHRFQ8YFY" },
  ],
  광주: [
    { title: "광주 공룡쇼 1", id: "dQw4w9WgXcQ" },
    { title: "광주 공룡쇼 2", id: "KxJjSxGZ-ew" },
  ],
  창원: [
    { title: "창원 공룡쇼 1", id: "4NRXx6U8ABQ" },
    { title: "창원 공룡쇼 2", id: "L_jWHffIx5E" },
  ],
};

const regionGrid = document.getElementById("regionGrid");
const regionTitle = document.getElementById("regionTitle");
const videoList = document.getElementById("videoList");
const playerRegion = document.getElementById("playerRegion");

let currentRegion = null;
let currentVideoId = null;

let player = null;

// 홈 카드 생성
function buildHome() {
  regionGrid.innerHTML = "";
  regions.forEach((name) => {
    const card = document.createElement("div");
    card.className = "region-card";

    card.innerHTML = `
      <button class="region-card-btn" onclick="openRegion('${name}')">
        <div class="region-thumb-deco"></div>
        <div class="region-play">
          <div class="region-play-circle">▶</div>
        </div>
      </button>
      <div class="region-name">${name}</div>
    `;

    regionGrid.appendChild(card);
  });
}

// 페이지 전환
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function goHome() {
  showPage("homePage");
}

function openSettings() {
  // 지금은 간단히 설명만 넣어둘게
  const settingsList = document.getElementById("settingsList");
  settingsList.innerHTML = `
    <p>설정 화면은 나중에<br>각 지역 영상 링크를 직접 추가/수정하는 곳으로 만들 수 있어요. 😊</p>
  `;
  showPage("settingsPage");
}

// 지역 열기
function openRegion(name) {
  currentRegion = name;
  regionTitle.textContent = name;

  const videos = regionVideos[name] || [];
  videoList.innerHTML = "";

  videos.forEach((v, idx) => {
    const item = document.createElement("div");
    item.className = "video-item";

    item.innerHTML = `
      <div class="video-title">${v.title}</div>
      <button class="video-play-btn" onclick="openPlayer('${v.id}')">보기</button>
    `;
    videoList.appendChild(item);
  });

  if (videos.length === 0) {
    videoList.innerHTML =
      '<p>아직 등록된 영상이 없어요. 나중에 설정에서 추가할 수 있어요.</p>';
  }

  showPage("regionPage");
}

// 유튜브 플레이어 준비
function ensurePlayer(videoId) {
  if (player) {
    player.loadVideoById(videoId);
  } else if (window.YT && YT.Player) {
    player = new YT.Player("youtubeFrame", {
      videoId,
      playerVars: { rel: 0, playsinline: 1 },
      events: {},
    });
  } else {
    // API가 아직 안 뜨면 조금 있다가 다시 시도
    setTimeout(() => ensurePlayer(videoId), 400);
  }
}

// 재생 화면 열기
function openPlayer(videoId) {
  currentVideoId = videoId;
  playerRegion.textContent = currentRegion || "";

  showPage("playerPage");
  ensurePlayer(videoId);
}

// 뒤로가기: 지역 리스트로
function backToRegion() {
  showPage("regionPage");
}

/* ===== 재생 컨트롤 ===== */

function restartVideo() {
  if (!player) return;
  player.seekTo(0, true);
}

function togglePlay() {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === 1) {
    player.pauseVideo();
    document.getElementById("playPauseBtn").textContent = "▶ 재생";
  } else {
    player.playVideo();
    document.getElementById("playPauseBtn").textContent = "⏸ 일시정지";
  }
}

function pauseVideo() {
  if (!player) return;
  player.pauseVideo();
  document.getElementById("playPauseBtn").textContent = "▶ 재생";
}

// 유튜브 API가 준비되면 호출되는 전역 함수 (꼭 있어야 함)
function onYouTubeIframeAPIReady() {
  // 처음에는 아무것도 하지 않음.
}

// 초기 실행
buildHome();
