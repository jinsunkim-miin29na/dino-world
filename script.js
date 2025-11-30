const regions = ["용인", "인천", "아산", "시흥", "정장", "정주"];

const sampleThumb =
  "https://picsum.photos/seed/dino/300/200"; // 임시 썸네일

const regionGrid = document.getElementById("regionGrid");
const regionTitle = document.getElementById("regionTitle");
const videoList = document.getElementById("videoList");

let currentRegion = "";
let player;
let currentVideoId = "";

loadHome();

/* ------------------------
    HOME 생성
------------------------- */

function loadHome() {
  regionGrid.innerHTML = "";

  regions.forEach((name) => {
    regionGrid.innerHTML += `
      <div class="region-card" onclick="openRegion('${name}')">
        <div class="region-thumb-wrapper">
          <img src="${sampleThumb}" class="region-thumb" />
          <div class="region-thumb-overlay">
            <div class="region-play-bubble">▶</div>
          </div>
        </div>
        <div class="region-name">${name}</div>
      </div>
    `;
  });
}

/* ------------------------
    페이지 이동
------------------------- */

function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => (p.classList.remove("active")));
  document.getElementById(id).classList.add("active");
}

function goHome() {
  showPage("homePage");
}

function openRegion(name) {
  currentRegion = name;
  regionTitle.innerText = name;
  showPage("regionPage");

  loadRegionVideos();
}

/* ------------------------
    지역 영상 목록 생성
------------------------- */

function loadRegionVideos() {
  videoList.innerHTML = `
    <div class="video-item" onclick="openPlayer('dQw4w9WgXcQ')">예시 영상 1</div>
    <div class="video-item" onclick="openPlayer('oHg5SJYRHA0')">예시 영상 2</div>
  `;
}

/* ------------------------
    플레이어
------------------------- */

function openPlayer(videoId) {
  currentVideoId = videoId;
  document.getElementById("playerRegion").innerText = currentRegion;

  const embed = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  document.getElementById("youtubeFrame").src = embed;

  showPage("playerPage");
  player = new YT.Player("youtubeFrame");
}

function backToRegion() {
  showPage("regionPage");
}

/* 재생 컨트롤 */
function restartVideo() {
  player.seekTo(0);
}

function togglePlay() {
  if (player.getPlayerState() === 1) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function pauseVideo() {
  player.pauseVideo();
}
