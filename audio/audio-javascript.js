const audio = document.getElementById("background-audio");
const musicIcon = document.querySelector(".music-icon");
const musicModal = document.querySelector(".music-modal");
const closeBtn = document.querySelector(".close-btn");
const songTitle = document.querySelector(".song-title");
const playPauseBtn = document.querySelector(".play-pause-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const volumeSlider = document.querySelector(".volume-slider");

// Danh sách bài hát (thay đường dẫn bằng file nhạc thật của bạn)
// Danh sách bài hát
const playlist = [
  {
    title: "Call of Silence",
    src: "/Around_VN_With_HCT_project/audio/Call of Silence.mp3",
  },
  { title: "Đen Vâu", src: "/Around_VN_With_HCT_project/audio/denvau.mp3" },
  {
    title: "Hello Việt Nam",
    src: "/Around_VN_With_HCT_project/audio/Hello Viet Nam.mp3",
  },
  {
    title: "le voyageur du monde",
    src: "/Around_VN_With_HCT_project/audio/le-voyageur-du-monde.mp3",
  },
];

// Khôi phục trạng thái từ localStorage hoặc đặt mặc định
let currentSongIndex = localStorage.getItem("currentSongIndex")
  ? parseInt(localStorage.getItem("currentSongIndex"))
  : 0;
audio.volume = localStorage.getItem("volume")
  ? parseFloat(localStorage.getItem("volume"))
  : 0.3; // Âm lượng mặc định 0.3
volumeSlider.value = audio.volume;

// Hàm load bài hát
function loadSong(index) {
  audio.src = playlist[index].src;
  songTitle.textContent = playlist[index].title;
  audio.play().catch((error) => {
    console.log("Trình duyệt chặn autoplay: ", error);
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // Hiển thị nút play nếu bị chặn
  });
  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  localStorage.setItem("currentSongIndex", index); // Lưu bài hát hiện tại
}

// Tự động phát nhạc khi trang tải
window.addEventListener("load", () => {
  loadSong(currentSongIndex); // Tự động load và phát bài hát
  if (localStorage.getItem("isPlaying") === "true") {
    audio.currentTime = parseFloat(localStorage.getItem("currentTime") || 0);
    audio.play().catch((error) => {
      console.log("Trình duyệt chặn autoplay: ", error);
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
  } else if (!localStorage.getItem("isPlaying")) {
    // Nếu không có trạng thái trước đó, tự động phát lần đầu
    audio.play().catch((error) => {
      console.log("Trình duyệt chặn autoplay: ", error);
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

// Cập nhật thời gian và trạng thái phát liên tục
audio.addEventListener("timeupdate", () => {
  localStorage.setItem("currentTime", audio.currentTime);
  localStorage.setItem("isPlaying", !audio.paused);
});

// Mở modal khi click icon
musicIcon.addEventListener("click", () => {
  musicModal.style.display = "block";
  if (!audio.src) loadSong(currentSongIndex);
});

// Đóng modal
closeBtn.addEventListener("click", () => {
  musicModal.style.display = "none";
});

// Điều khiển phát/tạm dừng
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
  localStorage.setItem("isPlaying", !audio.paused);
});

// Chuyển bài trước
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
});

// Chuyển bài tiếp theo
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
});

// Tự động chuyển bài khi hết
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
});

// Điều khiển âm lượng
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem("volume", audio.volume); // Lưu âm lượng
});

// Tắt nhạc khi phát video
document.addEventListener(
  "play",
  (e) => {
    if (e.target.tagName === "VIDEO") {
      audio.pause();
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      localStorage.setItem("isPlaying", false);
    }
  },
  true
);
