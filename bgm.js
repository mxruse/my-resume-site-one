(function () {
  "use strict";

  var welcome = document.getElementById("musicWelcome");
  var enterButton = document.getElementById("musicWelcomeEnter");
  var audio = document.getElementById("backgroundMusic");
  var control = document.getElementById("musicControl");
  var icon = control ? control.querySelector(".music-control-icon") : null;
  if (!welcome || !enterButton || !audio || !control || !icon) return;
  var hasEntered = false;

  // Keep the music subtle so it supports the visual experience without
  // competing with the resume content. The welcome button supplies the user
  // gesture required by modern browsers before audio can begin.
  audio.loop = true;
  audio.volume = 0.15;
  audio.pause();

  function setPlayingState(isPlaying) {
    control.classList.toggle("is-playing", isPlaying);
    control.setAttribute("aria-pressed", String(isPlaying));
    control.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
    control.title = isPlaying ? "暂停背景音乐" : "播放背景音乐";
    icon.textContent = isPlaying ? "🔊" : "🔇";
  }

  function playMusic() {
    var playRequest = audio.play();
    // A missing/unsupported file or a browser autoplay restriction should
    // never interrupt the page. The control simply remains in the paused
    // state until the user tries again.
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(function () { setPlayingState(false); });
    }
  }

  audio.addEventListener("play", function () { setPlayingState(true); });
  audio.addEventListener("pause", function () { setPlayingState(false); });
  audio.addEventListener("error", function () { setPlayingState(false); });

  enterButton.addEventListener("click", function () {
    if (hasEntered) return;
    hasEntered = true;
    enterButton.disabled = true;
    playMusic();
    welcome.classList.add("is-closing");
    window.setTimeout(function () {
      welcome.classList.add("is-hidden");
      welcome.setAttribute("aria-hidden", "true");
      document.body.classList.remove("music-welcome-open");
    }, 720);
  });

  control.addEventListener("click", function () {
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
    }
  });

  setPlayingState(false);
})();
