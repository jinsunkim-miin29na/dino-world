// 8개 지역
const regions = ["용인", "인천", "동탄", "아산", "시흥", "세종", "광주", "창원"];

// 지역별 영상 (용인은 네가 준 실제 링크!)
const regionVideos = {
  용인: [{ title: "용인 공룡쇼 1", id: "ZgPjkSKD7WA" }],
  인천: [],
  동탄: [],
  아산: [],
  시흥: [],
  세종: [],
  광주: [],
  창원: [],
};

const home = document.getElementById("home");
const regionScreen = document.getElementById("regionScreen");
const playerScreen = document.getElementById("playerScreen");
const settingsScreen = document.getElementById("settingsScreen");

const regionGrid = document.getElementById("regionGrid");
const regionTitle = document.getElementById("regionTitle");
const videoList = document.getElementById("videoList");

let currentRegion = null;
let player = null;
let ytReady = false;

// 홈 카드 생성
function loadRegions() {
  regionGrid.innerHTML = "";
  regions.forEach((r) => {
    const card = document.createElement("div");
    card.className = "region-card";
    card.textContent = r;
    card.onclick = () => openRegion(r);
    regionGrid.appendChild(card);
  });
}

// 화면 전환
function show(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

function goHome() { show(home); }
function openSettings() { show(settingsScreen); }

// 지역 화면
function openRegion(name) {
  currentRegion = name;
  regionTitle.textContent = name;

  videoList.innerHTML = "";
  const list = regionVideos[name];

  if (list.length === 0) {
    videoList.innerHTML = "<p>등록된 영상 없음</p>";
  } else {
    list.forEach((v) => {
      const item = document.createElement("div");
      item.className = "video-item";
      item.innerHTML = `
        <span>${v.title}</span>
        <button onclick="openPlayer('${v.id}')">보기</button>
      `;
      videoList.appendChild(item);
    });
  }

  show(regionScreen);
}

// 유튜브 API 준비
function onYouTubeIframeAPIReady() {
  ytReady = true;
}

// 재생 화면
function openPlayer(videoId) {
  show(playerScreen);
  document.getElementById("playerRegion").textContent = currentRegion;

  if (!ytReady) {
    setTimeout(() => openPlayer(videoId), 300);
    return;
  }

  if (player) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player("youtubePlayer", {
      videoId,
      playerVars: { playsinline: 1, rel: 0 },
    });
  }
}

function backToRegion() {
  show(regionScreen);
}

// 재생 컨트롤
function restartVideo() { if (player) player.seekTo(0, true); }
function togglePlay() {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === 1) {
    player.pauseVideo();
    playPauseBtn.textContent = "▶";
  } else {
    player.playVideo();
    playPauseBtn.textContent = "⏸";
  }
}
function pauseVideo() { if (player) player.pauseVideo(); }

// 초기
loadRegions();
