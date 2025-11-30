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

// 지역별 영상 (용인은 네가 준 링크 사용)
const regionVideos = {
  용인: [
    {
      title: "용인 공룡쇼 1",
      // https://youtu.be/ZgPjkSKD7WA?si=... 에서 ID만 추출
      id: "ZgPjkSKD7WA",
    },
  ],
  인천: [
    { title: "인천 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "인천 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  동탄: [
    { title: "동탄 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "동탄 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  아산: [
    { title: "아산 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "아산 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  시흥: [
    { title: "시흥 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "시흥 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  세종: [
    { title: "세종 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "세종 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  광주: [
    { title: "광주 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "광주 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
  창원: [
    { title: "창원 공룡쇼 예시 1", id: "ZgPjkSKD7WA" },
    { title: "창원 공룡쇼 예시 2", id: "ZgPjkSKD7WA" },
  ],
};

const regionGrid = document.getElementById("regionGrid");
const regionTitle = document.getElementById("regionTitle");
const videoList = document.getElementById("videoList");
const playerRegion = document.getElementById("playerRegion");

let currentRegion = null;
let currentVideoId = null;

let player = null;
let ytReady = false;

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
  showPage("settingsPage");
}

// 지역 열기
function openRegion(name) {
  currentRegion = name;
  regionTitle.textContent = name;

  const videos = regionVideos[name] || [];
  videoList.innerHTML = "";

  videos.forEach((v) => {
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
  if (!ytReady) {
    // API 아직이면 조금 있다가 다시
    setTimeout(() => ensurePlayer(videoId), 300);
    return;
  }

  if (player) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player("youtubePlayer", {
      videoId,
      playerVars: {
        rel: 0,
        playsinline: 1,
        controls: 1,
      },
      events: {
        onReady: () => {
          player.playVideo();
        },
      },
    });
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

// 유튜브 API 준비 콜백 (전역 함수 이름 고정)
function onYouTubeIframeAPIReady() {
  ytReady = true;
}

// 초기 실행
buildHome();
