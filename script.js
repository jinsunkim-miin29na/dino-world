// ===============================
// 기본 데이터 & 상태
// ===============================
const REGIONS = ["용인", "동탄", "인천", "아산", "시흥", "세종", "창원", "광주"];
const STORAGE_KEY = "dinoWorldVideos_v2";

let videosByRegion = {};
let currentRegion = null;

// YouTube 관련
let player = null;
let currentVideoId = null;
let progressTimer = null;
let isPlaying = false;

// DOM 참조
let pages = {};
let homeBtn, settingsBtn;
let regionGrid, regionTitle, regionVideoList;
let settingsContainer;
let playerOverlay, playerRegionTitle, seekBar, currentTimeLabel, durationTimeLabel, playPauseImg;
let regionBackBtn, playerBackBtn, restartBtn, closeBtn;


// ===============================
// 초기화
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupButtons();
  loadStorage();
  renderRegionButtons();
  renderSettingsList();
  showPage("home");
});

function cacheElements() {
  homeBtn = document.getElementById("homeBtn");
  settingsBtn = document.getElementById("settingsBtn");

  pages.home = document.getElementById("homePage");
  pages.region = document.getElementById("regionPage");
  pages.settings = document.getElementById("settingsPage");

  regionGrid = document.getElementById("regionGrid");
  regionTitle = document.getElementById("regionTitle");
  regionVideoList = document.getElementById("regionVideoList");

  settingsContainer = document.getElementById("settingsContainer");

  playerOverlay = document.getElementById("playerOverlay");
  playerRegionTitle = document.getElementById("playerRegionTitle");
  seekBar = document.getElementById("seekBar");
  currentTimeLabel = document.getElementById("currentTime");
  durationTimeLabel = document.getElementById("durationTime");
  playPauseImg = document.getElementById("playPauseImg");

  regionBackBtn = document.getElementById("regionBackBtn");
  playerBackBtn = document.getElementById("playerBackBtn");
  restartBtn = document.getElementById("restartBtn");
  closeBtn = document.getElementById("closeBtn");

  seekBar.addEventListener("input", onSeekBarInput);
}

function setupButtons() {
  homeBtn.onclick = () => {
    closePlayer();
    showPage("home");
  };

  settingsBtn.onclick = () => {
    closePlayer();
    showPage("settings");
    renderSettingsList();
  };

  regionBackBtn.onclick = () => {
    showPage("home");
  };

  playerBackBtn.onclick = () => {
    closePlayer();
  };

  restartBtn.onclick = () => restartVideo();
  closeBtn.onclick = () => closePlayer();

  document.getElementById("playPauseBtn").onclick = () => togglePlayPause();
}


// ===============================
// 저장소 관리
// ===============================
function loadStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  videosByRegion = saved ? JSON.parse(saved) : {};

  REGIONS.forEach(r => {
    if (!videosByRegion[r]) videosByRegion[r] = [];
  });
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videosByRegion));
}


// ===============================
// 페이지 전환
// ===============================
function showPage(name) {
  Object.entries(pages).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== name);
  });

  // 홈화면일 때는 홈버튼 숨김
  homeBtn.classList.toggle("hidden", name === "home");
}


// ===============================
// 홈: 지역 카드 렌더링
// ===============================
function renderRegionButtons() {
  regionGrid.innerHTML = "";

  REGIONS.forEach(region => {
    const card = document.createElement("button");
    card.className = "region-card";

    // 썸네일: 첫 번째 영상이 있으면 그 썸네일, 없으면 기본 공룡
    const list = videosByRegion[region] || [];
    let thumbUrl = "icons/default_dino.png";

    if (list.length > 0) {
      const first = list[0];
      const id = extractYouTubeId(first) || first;
      thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    card.innerHTML = `
      <div class="region-thumb-wrapper">
        <img src="${thumbUrl}" class="region-thumb" alt="${region} 썸네일">
        <div class="region-thumb-overlay">
          <div class="region-play-bubble">▶</div>
        </div>
      </div>
      <div class="region-name">${region}</div>
    `;

    card.onclick = () => openRegion(region);
    regionGrid.appendChild(card);
  });
}


// ===============================
// 지역 페이지
// ===============================
function openRegion(region) {
  currentRegion = region;
  regionTitle.textContent = `${region} 공룡쇼`;

  renderRegionVideos();
  showPage("region");
}

function renderRegionVideos() {
  const list = videosByRegion[currentRegion] || [];
  regionVideoList.innerHTML = "";

  if (!list.length) {
    regionVideoList.innerHTML = `<p class="subtitle small">등록된 영상이 없어요. 설정에서 추가해 주세요.</p>`;
    return;
  }

  list.forEach((item, idx) => {
    const id = extractYouTubeId(item) || item;
    const card = document.createElement("div");
    card.className = "video-card";
    card.onclick = () => openPlayer(currentRegion, id, idx);

    const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const label = list.length === 1 ? `${currentRegion} 공룡쇼` : `영상 ${idx + 1}`;

    card.innerHTML = `
      <div class="video-thumb"><img src="${thumb}" alt="${label} 썸네일"></div>
      <div class="video-info">
        <div class="video-title">${label}</div>
        <div class="video-subtitle">눌러서 재생</div>
      </div>
    `;

    regionVideoList.appendChild(card);
  });
}


// ===============================
// 설정 페이지 (카드 스타일)
// ===============================
function renderSettingsList() {
  if (!settingsContainer) return;

  settingsContainer.innerHTML = "";

  REGIONS.forEach(region => {
    const card = document.createElement("div");
    card.className = "settings-region-card";

    const title = document.createElement("div");
    title.className = "settings-region-title";
    title.textContent = region;
    card.appendChild(title);

    const list = videosByRegion[region] || [];
    if (!list.length) {
      const p = document.createElement("p");
      p.className = "settings-video-url";
      p.textContent = "등록된 영상 없음";
      card.appendChild(p);
    } else {
      list.forEach(item => {
        const p = document.createElement("p");
        p.className = "settings-video-url";
        // URL이면 그대로, ID만 저장된 경우에는 URL 형태로 보여주기
        if (item.startsWith("http")) p.textContent = item;
        else p.textContent = `https://youtu.be/${item}`;
        card.appendChild(p);
      });
    }

    const addBtn = document.createElement("button");
    addBtn.className = "add-video-btn";
    addBtn.textContent = "+ 영상 추가";
    addBtn.onclick = () => openAddVideoPrompt(region);

    card.appendChild(addBtn);
    settingsContainer.appendChild(card);
  });
}

function openAddVideoPrompt(region) {
  const url = prompt(`${region} 지역에 추가할 유튜브 링크를 입력하세요:`);
  if (!url) return;

  const id = extractYouTubeId(url);
  if (!id) {
    alert("유효한 유튜브 링크가 아니에요.");
    return;
  }

  // URL 그대로 저장 (ID만 저장하고 싶으면 url 대신 id)
  videosByRegion[region].push(url.trim());
  saveStorage();

  renderSettingsList();
  if (currentRegion === region) renderRegionVideos();
}


// ===============================
// 유튜브 ID 추출
// ===============================
function extractYouTubeId(text) {
  if (!text) return null;
  // 이미 ID만 들어온 경우 (11글자, 특수문자)
  if (!text.includes("http") && text.length === 11) {
    return text;
  }

  const reg = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;
  const match = text.match(reg);
  return match ? match[1] : null;
}


// ===============================
// 유튜브 플레이어
// ===============================
function onYouTubeIframeAPIReady() {
  // 처음에는 아무 것도 하지 않음
}

function ensurePlayer(videoId) {
  if (player) {
    player.loadVideoById(videoId);
    return;
  }

  player = new YT.Player("player", {
    videoId,
    playerVars: {
      controls: 0,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: () => {
        player.playVideo();
        startProgress();
        isPlaying = true;
        updatePlayButton();
      },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING) {
          isPlaying = true;
          startProgress();
        } else {
          isPlaying = false;
          stopProgress();
        }
        updatePlayButton();
      }
    }
  });
}

function openPlayer(region, videoId, idx) {
  currentVideoId = videoId;
  const label = `${region} 공룡쇼${idx != null ? ` · 영상 ${idx + 1}` : ""}`;
  playerRegionTitle.textContent = label;

  playerOverlay.classList.remove("hidden");
  playerOverlay.setAttribute("aria-hidden", "false");

  ensurePlayer(videoId);
}

function closePlayer() {
  playerOverlay.classList.add("hidden");
  playerOverlay.setAttribute("aria-hidden", "true");
  if (player) player.stopVideo();
  stopProgress();
}


// ===============================
// 컨트롤 버튼들
// ===============================
function togglePlayPause() {
  if (!player) return;
  if (isPlaying) player.pauseVideo();
  else player.playVideo();
}

function restartVideo() {
  if (player) player.seekTo(0, true);
}

function onSeekBarInput(e) {
  if (!player) return;
  const percent = e.target.value;
  const duration = player.getDuration();
  player.seekTo((duration * percent) / 100, true);
}

function updatePlayButton() {
  if (!playPauseImg) return;
  playPauseImg.src = isPlaying ? "icons/ic_pause.png" : "icons/ic_play.png";
}


// ===============================
// 진행바 업데이트
// ===============================
function startProgress() {
  stopProgress();
  progressTimer = setInterval(updateProgress, 400);
}

function stopProgress() {
  if (progressTimer) clearInterval(progressTimer);
}

function updateProgress() {
  if (!player) return;
  const dur = player.getDuration();
  const cur = player.getCurrentTime();
  if (!dur) return;

  seekBar.value = (cur / dur) * 100;
  currentTimeLabel.textContent = formatTime(cur);
  durationTimeLabel.textContent = formatTime(dur);
}

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
