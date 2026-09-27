const worm = document.querySelector(".worm");
const targetLeft = 8;
const step = 20;
const pause = 250;

function moveWorm() {
  const currentLeft = worm.offsetLeft;
  const nextLeft = Math.max(targetLeft, currentLeft - step);

  // 움직이는 그림을 보이며 20px(마지막은 남은 거리만) 이동한다.
  worm.classList.add("moving");
  worm.style.left = `${nextLeft}px`;

  function finishStep(event) {
    // 이미지의 opacity 전환 이벤트는 무시하고 .worm의 left 전환만 받는다.
    if (event.target !== worm || event.propertyName !== "left") return;
    worm.removeEventListener("transitionend", finishStep);

    // 한 걸음이 끝나면 정지 그림으로 바꾼다.
    worm.classList.remove("moving");

    // 마지막 위치는 반드시 left: 8px이다.
    if (nextLeft === targetLeft) {
      const $envelope = document.querySelector(".envelope");
      const $footer = document.querySelector(".footer");
      $envelope.style.opacity = 1;
      $footer.style.opacity = 1;
      return; // 도착했을 때 밑에 편지 opacity 1로 바꾸자
    }

    window.setTimeout(moveWorm, pause);
  }

  worm.addEventListener("transitionend", finishStep);
}

// 초기 위치가 렌더링된 뒤 첫 걸음을 시작한다.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    moveWorm();
  });
});

const envelope = document.querySelector(".envelope");
const openLetter = document.querySelector(".envelope-open");
const track = document.querySelector(".letter-track");
const pages = [...document.querySelectorAll(".letter-track .layer")];
const previousButton = document.querySelector(".slide-button.prev");
const nextButton = document.querySelector(".slide-button.next");
const closeButton = document.querySelector(".close-letter");
const slideStatus = document.querySelector(".slide-status");
let currentPage = 0;
let touchStartX = 0;

function showPage(pageIndex) {
  currentPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
  track.style.transform = `translateX(-${currentPage * 100}%)`;
  openLetter.classList.toggle("is-page-two", currentPage === 1);
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
  slideStatus.textContent = `${currentPage + 1} / ${pages.length}`;
}

envelope.addEventListener("click", () => {
  openLetter.classList.add("is-open");
  envelope.style.pointerEvents = "none";
  showPage(0);
});

closeButton.addEventListener("click", () => {
  openLetter.classList.remove("is-open");
  envelope.style.pointerEvents = "auto";
  showPage(0);
});

previousButton.addEventListener("click", () => showPage(currentPage - 1));
nextButton.addEventListener("click", () => showPage(currentPage + 1));

track.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

track.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 50) return;
  showPage(currentPage + (distance < 0 ? 1 : -1));
});

showPage(0);

const video = document.querySelector("video");

let count = 0;

video.addEventListener("ended", () => {
  count++;

  if (count >= 3) {
    video.style.opacity = "0";
    return;
  }

  video.currentTime = 0;
  video.play();
});
