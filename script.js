// 8개 지역
const regionNames = ["용인", "인천", "동탄", "아산", "시흥", "세종", "광주", "창원"];

// 지역별 영상 (여러 개 가능)
const regionVideos = {
  용인: [
    { title: "용인 공룡쇼 1", id: "ZgPjkSKD7WA" },
    { title: "용인 공룡쇼 2", id: "qRdpwpHaN9k" },
  ],
  인천: [
    { title: "인천 공룡쇼 1", id: "-_YndV1RjRc" },
  ],
  동탄: [
    { title: "동탄 공룡쇼 1", id: "058QwG7IRe8" }, // 새로 준 링크
    { title: "동탄 공룡쇼 2", id: "uueASoGmhoc" }, // 이전에 줬던 링크도 예시로 추가
  ],
  아산: [
    { title: "아산 공룡쇼 1", id: "3G4s16NXNKQ" },
  ],
  시흥: [
    { title: "시흥 공룡쇼 1", id: "058QwG7IRe8" }, // 같은 ID라도 상관 없음
  ],
  세종: [
    { title: "세종 공룡쇼 1", id: "MguH4CskJ6M" },
  ],
  광주: [
    // 비어 있으면 기본 공룡 썸네일 + "영상 없음" 처리
  ],
  창원: [
    { title: "창원 공룡쇼 1", id: "TjNrSYBo5zg" },
  ],
};

const home = document.getElementById("home");
const regionScreen = document.getElementById("regionScreen");
const playerScreen = document.getElementById("playerScreen");
const settingsScreen = document.getElementById("settingsScreen");

const homeRow1 = document.getElementById("homeRow1");
const homeRow2 = document.getElementById("homeRow2");
const homeRow3 = document.getElementById("homeRow3");

const regionTitle = document.getElementById("regionTitle");
const videoList = document.getElementById("videoList");
const playerRegion = document.getElementById("playerRegion");

let currentRegion = null;
let player = null;
let ytReady = false;

// 썸네일 URL 생성 함수
function getYoutubeThumb(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// 홈 화면 카드 3/3/2 구성
function buildHomeCards() {
  homeRow1.innerHTML = "";
  homeRow2.innerHTML = "";
  homeRow3.innerHTML = "";

  regionNames.forEach((name, index) => {
    const row =
      index < 3 ? homeRow1 : index < 6 ? homeRow2 : homeRow3;

    const videos = regionVideos[name] || [];
    let thumbUrl = "default_dino.png"; // 광주처럼 영상 없을 때 기본 이미지 (파일 경로 맞게 올려줘)

    if (videos.length > 0) {
      thumbUrl = getYoutubeThumb(videos[0].id);
    }

    const card = document.createElement("div");
    card.className = "region-card";
    card.onclick = () => openRegion(name);

    card.innerHTML = `
      <div class="region-thumb-wrap">
        <img src="${thumbUrl}" alt="${name} 썸네일" />
        <div class="region-thumb-overlay">
          <div class="region-name">${name}</div>
        </div>
      </div>
    `;

    row.appendChild(card);
  });
}

// 화면 전환 공통
function showScreen(el) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
}

function goHome() {
  showScreen(home);
}

function openSettings() {
  showScreen(settingsScreen);
}

// 지역 화면 열기
function openRegion(name) {
  currentRegion = name;
  regionTitle.textContent = name;

  const videos = regionVideos[name] || [];
  videoList.innerHTML = "";

  if (videos.length === 0) {
    // 영상 없을 때 기본 카드
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-thumb-wrap">
        <img src="default_dino.png" alt="기본 공룡" />
        <div class="video-thumb-overlay">
          <div class="video-title">등록된 영상이 없습니다</div>
        </div>
      </div>
    `;
    videoList.appendChild(card);
  } else {
    // 영상 여러 개 썸네일 카드로
    videos.forEach((v) => {
      const thumb = getYoutubeThumb(v.id);
      const card = document.createElement("div");
      card.className = "video-card";
      card.onclick = () => openPlayer(v.id);

      card.innerHTML = `
        <div class="video-thumb-wrap">
          <img src="${thumb}" alt="${v.title}" />
          <div class="video-thumb-overlay">
            <div class="video-title">${v.title}</div>
          </div>
        </div>
      `;

      videoList.appendChild(card);
    });
  }

  showScreen(regionScreen);
}

// 유튜브 API 준비 콜백
function onYouTubeIframeAPIReady() {
  ytReady = true;
}

// 플레이어 준비
function ensurePlayer(videoId) {
  if (!ytReady) {
    setTimeout(() => ensurePlayer(videoId), 300);
    return;
  }

  if (player) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player("youtubePlayer", {
      videoId,
      playerVars: {
        playsinline: 1,
        rel: 0,
      },
    });
  }
}

// 재생 화면 열기
function openPlayer(videoId) {
  playerRegion.textContent = currentRegion || "";
  showScreen(playerScreen);
  ensurePlayer(videoId);
}

// 재생 화면에서 뒤로가기
function backToRegion() {
  showScreen(regionScreen);
}

// 재생 컨트롤
function restartVideo() {
  if (player) player.seekTo(0, true);
}

function togglePlay() {
  if (!player) return;
  const state = player.getPlayerState();
  const btn = document.getElementById("playPauseBtn");

  if (state === 1) {
    player.pauseVideo();
    btn.textContent = "▶ 재생";
  } else {
    player.playVideo();
    btn.textContent = "⏸ 일시정지";
  }
}

function pauseVideo() {
  if (player) {
    player.pauseVideo();
    document.getElementById("playPauseBtn").textContent = "▶ 재생";
  }
}

// 초기 실행
buildHomeCards();
