/* Lightbox for all content images
 * - Click image to open
 * - Click overlay blank/close button/ESC to close
 * - Mobile-friendly sizing
 */
(function () {
  // Build lightbox DOM once to keep page structure clean.
  var lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");

  var closeBtn = document.createElement("button");
  closeBtn.className = "image-lightbox-close";
  closeBtn.setAttribute("type", "button");
  closeBtn.setAttribute("aria-label", "关闭图片预览");
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

  var lightboxImage = document.createElement("img");
  lightboxImage.className = "image-lightbox-image";
  lightboxImage.setAttribute("alt", "放大预览图");

  var prevBtn = document.createElement("button");
  prevBtn.className = "image-lightbox-nav image-lightbox-prev";
  prevBtn.setAttribute("type", "button");
  prevBtn.setAttribute("aria-label", "上一张");
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';

  var nextBtn = document.createElement("button");
  nextBtn.className = "image-lightbox-nav image-lightbox-next";
  nextBtn.setAttribute("type", "button");
  nextBtn.setAttribute("aria-label", "下一张");
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);
  lightbox.appendChild(lightboxImage);
  document.body.appendChild(lightbox);

  var isOpen = false;
  var currentIndex = -1;
  var galleryImages = [];
  var touchStartX = 0;
  var touchStartY = 0;

  function getGalleryImages() {
    return Array.prototype.slice
      .call(document.querySelectorAll("img"))
      .filter(function (img) {
        return !img.classList.contains("image-lightbox-image");
      });
  }

  function setImageByIndex(index) {
    if (!galleryImages.length) return;
    var safeIndex = (index + galleryImages.length) % galleryImages.length;
    var sourceImage = galleryImages[safeIndex];
    currentIndex = safeIndex;
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt || "放大预览图";
  }

  function openLightbox(index, images) {
    galleryImages = images || getGalleryImages();
    if (!galleryImages.length) return;
    setImageByIndex(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    isOpen = true;
  }

  function closeLightbox() {
    if (!isOpen) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    isOpen = false;
    currentIndex = -1;
  }

  function showPrev() {
    if (!isOpen) return;
    setImageByIndex(currentIndex - 1);
  }

  function showNext() {
    if (!isOpen) return;
    setImageByIndex(currentIndex + 1);
  }

  // Delegated click support so dynamically added images also work.
  document.addEventListener("click", function (event) {
    var targetImg = event.target.closest("img");
    if (!targetImg) {
      // Expand hit-area: clicking card chrome also opens its image.
      var imageHost = event.target.closest(".tech-thumb, .ppt-thumb, .creator-thumb, .nft-card, .nature-card");
      if (imageHost) {
        targetImg = imageHost.querySelector("img");
      }
    }
    if (!targetImg) return;
    if (targetImg.classList.contains("image-lightbox-image")) return;
    if (targetImg.closest(".image-lightbox")) return;
    if (targetImg.closest(".project-hub .concept-item")) return;
    if (event.target.closest(".canvas-world.is-dragging")) return;

    var currentImages = getGalleryImages();
    var index = currentImages.indexOf(targetImg);
    if (index >= 0) {
      openLightbox(index, currentImages);
    }
  });

  // Close button action.
  closeBtn.addEventListener("click", function () {
    closeLightbox();
  });

  prevBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    showNext();
  });

  // Click empty overlay area to close.
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard shortcuts for slideshow mode.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (!isOpen) return;

    if (event.key === "ArrowLeft") {
      showPrev();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  });

  // Mobile swipe support: left/right swipe to navigate.
  lightbox.addEventListener(
    "touchstart",
    function (event) {
      if (!isOpen || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    function (event) {
      if (!isOpen || !event.changedTouches.length) return;
      var endX = event.changedTouches[0].clientX;
      var endY = event.changedTouches[0].clientY;
      var deltaX = endX - touchStartX;
      var deltaY = endY - touchStartY;
      var absX = Math.abs(deltaX);
      var absY = Math.abs(deltaY);

      // Horizontal gesture threshold to avoid accidental switching.
      if (absX > 45 && absX > absY) {
        if (deltaX > 0) {
          showPrev();
        } else {
          showNext();
        }
      }
    },
    { passive: true }
  );
})();

/* Project-experience media reveal
 * Desktop: hover reveal
 * Mobile: tap toggle
 */
(function () {
  var projectItems = Array.prototype.slice.call(document.querySelectorAll(".concept-item"));
  if (!projectItems.length) return;

  function desktopHoverEnabled() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  projectItems.forEach(function (item) {
    var mediaBox = item.querySelector(".dev-media");
    if (!mediaBox) return;
    var isProjectEntry = item.hasAttribute("data-project-target");

    item.classList.add("has-media");

    item.addEventListener("mouseenter", function () {
      if (!desktopHoverEnabled()) return;
      item.classList.add("media-visible");
    });

    item.addEventListener("mouseleave", function () {
      if (!desktopHoverEnabled()) return;
      item.classList.remove("media-visible");
    });

    item.addEventListener("click", function (event) {
      if (isProjectEntry) return;
      if (desktopHoverEnabled()) return;

      // Keep existing lightbox behavior when tapping image/video content.
      if (event.target.closest(".dev-media img, .dev-media video, .dev-media button, .dev-media .tech-video-wrap, .dev-media .tech-thumb, .dev-media .ppt-thumb, .dev-media .creator-thumb, .dev-media .creator-media")) {
        return;
      }

      item.classList.toggle("media-visible");
    });
  });
})();

/* PPT image gallery loader
 * Attempts to read all PNG files from the target directory.
 * Falls back to placeholder block when directory listing is unavailable/empty.
 */
(function () {
  var pptMedia = document.querySelector(".ppt-media[data-dir]");
  if (!pptMedia) return;

  var dir = pptMedia.getAttribute("data-dir") || "";
  // Keep a deterministic fallback for static hosts that do not expose
  // directory listings (a common case on mobile/CDN deployments).  The
  // gallery can still discover additional files when a listing is available,
  // but these are the files shipped with this resume and should always load.
  var bundledGalleryFiles = [
    "幻灯片1.PNG",
    "幻灯片2.PNG",
    "幻灯片3.PNG",
    "幻灯片4.PNG",
    "幻灯片5.PNG",
    "幻灯片6.PNG",
    "幻灯片7.PNG",
    "幻灯片8.PNG",
    "幻灯片9.PNG"
  ];
  var pptGalleryReady = false;
  var pptGalleryLoading = false;
  var pptGalleryPromise = null;
  var candidateDirs = [dir, "./assets/images/ppt-design/", "assets/images/ppt-design/", "/assets/images/ppt-design/"]
    .filter(Boolean)
    .map(function (d) {
      return d.replace(/\\/g, "/").replace(/\/?$/, "/");
    })
    .filter(function (value, index, arr) {
      return arr.indexOf(value) === index;
    });

  function renderPlaceholder() {
    pptMedia.innerHTML = '<div class="ppt-placeholder">PPT图片待补充</div>';
  }

  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  function toPublicAssetUrl(src) {
    try {
      return new URL(src, document.baseURI).href;
    } catch (error) {
      return src;
    }
  }

  function normalizeFiles(matches) {
    var fileSet = new Set(
      matches
        .map(function (file) {
          return file.split("/").pop();
        })
        .filter(Boolean)
    );
    return Array.from(fileSet).sort(naturalCompare);
  }

  function renderImages(paths) {
    if (!paths.length) {
      renderPlaceholder();
      return;
    }
    pptMedia.innerHTML = "";
    paths.forEach(function (src, index) {
      var thumb = document.createElement("div");
      thumb.className = "ppt-thumb";
      thumb.style.setProperty("--i", String(index));
      thumb.style.zIndex = String(200 - index);

      var img = document.createElement("img");
      img.src = toPublicAssetUrl(src);
      img.alt = "PPT设计作品";
      img.onerror = function () {
        if (img.dataset.assetRetry === "true") return;
        img.dataset.assetRetry = "true";
        img.src = src;
      };
      img.loading = "lazy";
      thumb.appendChild(img);
      pptMedia.appendChild(thumb);
    });
    bindPptTiltEffects();
  }

  function hoverCapable() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function bindPptTiltEffects() {
    var thumbs = Array.prototype.slice.call(pptMedia.querySelectorAll(".ppt-thumb"));
    if (!thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("mouseenter", function () {
        if (!hoverCapable()) return;
        thumb.classList.remove("sheen-on");
        // Restart one-shot sheen animation per hover entry.
        void thumb.offsetWidth;
        thumb.classList.add("sheen-on");
      });

      thumb.addEventListener("mousemove", function (event) {
        if (!hoverCapable()) return;
        var rect = thumb.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * 6;
        var rotateX = (0.5 - py) * 6;
        thumb.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
        thumb.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
      });

      thumb.addEventListener("mouseleave", function () {
        thumb.style.setProperty("--rx", "0deg");
        thumb.style.setProperty("--ry", "0deg");
      });
    });
  }

  function bindTechTiltEffects() {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".tech-thumb"));
    if (!thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("mouseenter", function () {
        if (!hoverCapable()) return;
        thumb.classList.remove("sheen-on");
        void thumb.offsetWidth;
        thumb.classList.add("sheen-on");
      });

      thumb.addEventListener("mousemove", function (event) {
        if (!hoverCapable()) return;
        var rect = thumb.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * 6;
        var rotateX = (0.5 - py) * 6;
        thumb.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
        thumb.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
      });

      thumb.addEventListener("mouseleave", function () {
        thumb.style.setProperty("--rx", "0deg");
        thumb.style.setProperty("--ry", "0deg");
      });
    });
  }

  function bindCreatorTiltEffects() {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".creator-thumb"));
    if (!thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("mouseenter", function () {
        if (!hoverCapable()) return;
        thumb.classList.remove("sheen-on");
        void thumb.offsetWidth;
        thumb.classList.add("sheen-on");
      });

      thumb.addEventListener("mousemove", function (event) {
        if (!hoverCapable()) return;
        var rect = thumb.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * 6;
        var rotateX = (0.5 - py) * 6;
        thumb.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
        thumb.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
      });

      thumb.addEventListener("mouseleave", function () {
        thumb.style.setProperty("--rx", "0deg");
        thumb.style.setProperty("--ry", "0deg");
      });
    });
  }

  function bindTechVideoPlayback() {
    var wraps = Array.prototype.slice
      .call(document.querySelectorAll(".tech-video-wrap"))
      .filter(function (wrap) {
        return !wrap.closest(".project-hub");
      });
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
      var video = wrap.querySelector("video");
      var playBtn = wrap.querySelector(".tech-play-btn");
      if (!video || !playBtn) return;

      var poster = wrap.getAttribute("data-poster");
      if (poster) {
        wrap.style.setProperty("--poster-image", 'url("' + poster + '")');
      }

      function startPlayback() {
        if (!video.hasAttribute("controls")) {
          video.setAttribute("controls", "");
        }
        video.play().then(function () {
          wrap.classList.add("is-playing");
        }).catch(function () {
          // Fallback path: some environments only allow muted start.
          video.muted = true;
          video.play().then(function () {
            wrap.classList.add("is-playing");
          }).catch(function () {
            // Keep play button visible for manual retry if browser still blocks playback.
          });
        });
      }

      playBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        startPlayback();
      });

      wrap.addEventListener("click", function (event) {
        if (!wrap.classList.contains("is-playing")) {
          event.stopPropagation();
          startPlayback();
        }
      });

      video.addEventListener("click", function () {
        if (!wrap.classList.contains("is-playing")) {
          startPlayback();
        }
      });

      video.addEventListener("ended", function () {
        if (!video.loop) {
          wrap.classList.remove("is-playing");
        }
      });

      video.addEventListener("pause", function () {
        if (video.currentTime <= 0.05) {
          wrap.classList.remove("is-playing");
        }
      });
    });
  }

  function tryDirectoryListing() {
    var tasks = candidateDirs.map(function (baseDir) {
      return fetch(baseDir)
        .then(function (response) {
          if (!response.ok) throw new Error("Directory not reachable");
          return response.text();
        })
        .then(function (html) {
          var matches = Array.from(
            html.matchAll(/href=["']([^"']+\.(?:png|jpg|jpeg|webp))["']/gi),
            function (m) {
              return m[1];
            }
          );
          var files = normalizeFiles(matches);
          return files.map(function (file) {
            return baseDir + file;
          });
        })
        .catch(function () {
          return [];
        });
    });
    return Promise.all(tasks).then(function (resultSets) {
      var merged = resultSets.flat();
      return merged.filter(function (value, index, arr) {
        return arr.indexOf(value) === index;
      });
    });
  }

  function probeCommonExportNames() {
    var stems = [];
    for (var i = 1; i <= 40; i += 1) {
      stems.push(String(i));
      stems.push("0" + i);
      stems.push("slide-" + i);
      stems.push("slide" + i);
      stems.push("page-" + i);
      stems.push("page" + i);
      stems.push("ppt-" + i);
      stems.push("ppt" + i);
      stems.push("幻灯片" + i);
    }
    var exts = ["png", "PNG", "jpg", "JPG", "jpeg", "JPEG", "webp", "WEBP"];
    var candidatePaths = [];
    candidateDirs.forEach(function (baseDir) {
      stems.forEach(function (stem) {
        exts.forEach(function (ext) {
          candidatePaths.push(baseDir + stem + "." + ext);
        });
      });
    });

    function exists(src) {
      return new Promise(function (resolve) {
        var testImg = new Image();
        testImg.onload = function () {
          resolve(src);
        };
        testImg.onerror = function () {
          resolve(null);
        };
        testImg.src = src;
      });
    }

    return Promise.all(candidatePaths.map(exists)).then(function (results) {
      var valid = results.filter(Boolean);
      return valid.filter(function (value, index, arr) {
        return arr.indexOf(value) === index;
      });
    });
  }

  function rememberGalleryPaths(paths) {
    var clean = (paths || []).filter(Boolean);
    window.__pptDesignImages = clean;
    return clean;
  }

  function loadPptGallery() {
    if (pptGalleryReady) {
      return Promise.resolve(rememberGalleryPaths(window.__pptDesignImages || []));
    }
    if (pptGalleryLoading && pptGalleryPromise) {
      return pptGalleryPromise;
    }
    pptGalleryLoading = true;
    var loadedCount = 0;

    // On phones skip directory-index requests entirely.  Static hosts often
    // return an SPA document (or delay the request) for a directory URL,
    // which can leave the canvas waiting even though its images are available.
    var listingPromise = window.matchMedia("(max-width: 767px)").matches
      ? Promise.resolve([])
      : tryDirectoryListing();

    pptGalleryPromise = listingPromise
      .then(function (paths) {
        if (paths.length) {
          renderImages(paths);
          return paths;
        }
        // Use the shipped manifest directly.  Do not make the canvas depend
        // on probing hundreds of possible filenames: mobile browsers and
        // CDNs often throttle/deny those 404 probes even though the real
        // assets are present.  The data-dir is already the canonical public
        // path used by the 02 card, so these URLs are safe to seed eagerly.
        var bundledPaths = bundledGalleryFiles.map(function (file) {
          return dir + file;
        });
        renderImages(bundledPaths);
        return bundledPaths;
      })
      .catch(function () {
        renderPlaceholder();
        return [];
      })
      .then(function (paths) {
        var normalizedPaths = rememberGalleryPaths(paths);
        loadedCount = normalizedPaths.length;
        return normalizedPaths;
      })
      .then(function (paths) {
        pptGalleryReady = loadedCount > 0;
        pptGalleryLoading = false;
        pptGalleryPromise = null;
        return paths;
      });

    return pptGalleryPromise;
  }

  function attachPptWarmupTriggers() {
    var projectPptEntry = document.querySelector('[data-project-target="ppt"]');
    if (projectPptEntry) {
      projectPptEntry.addEventListener("mouseenter", loadPptGallery);
      projectPptEntry.addEventListener("focusin", loadPptGallery);
      projectPptEntry.addEventListener("click", loadPptGallery);
      projectPptEntry.addEventListener("touchstart", loadPptGallery, { passive: true });
    }

    document.addEventListener("project-panel-open", function (event) {
      if (event.detail && event.detail.target === "ppt") {
        loadPptGallery();
      }
    });
  }

  // Expose for the infinite-canvas module in this file.
  window.ensurePptGalleryLoaded = loadPptGallery;
  attachPptWarmupTriggers();

  // Static tech media (01 card) also uses the same tilt/sheen interaction.
  bindTechTiltEffects();
  bindCreatorTiltEffects();
  bindTechVideoPlayback();
})();

/* Immersive three-track SPA (project experience) */
(function () {
  var hub = document.getElementById("projectHub");
  var homeShell = document.getElementById("projectHomeShell");
  var stage = document.getElementById("projectStage");
  if (!hub || !homeShell || !stage) return;

  var entries = Array.prototype.slice.call(hub.querySelectorAll("[data-project-target]"));
  var panels = Array.prototype.slice.call(stage.querySelectorAll(".project-panel"));
  var backButtons = Array.prototype.slice.call(stage.querySelectorAll(".panel-back"));
  var activePanel = null;
  var closeTimer = null;
  var forcedThemeBeforeProject = null;

  // Keep the fixed subpage layer outside the scroll/content-visibility tree.
  // Some mobile WebViews clip fixed descendants of a section that uses
  // content-visibility, making taps appear to do nothing even though the
  // panel state changes correctly.
  if (stage.parentNode !== document.body) {
    document.body.appendChild(stage);
  }

  function updatePanelProgress(panel) {
    if (!panel) return;
    var progress = panel.querySelector(".panel-scroll-progress span");
    if (!progress) return;
    var maxScroll = Math.max(1, panel.scrollHeight - panel.clientHeight);
    var ratio = Math.max(0, Math.min(1, panel.scrollTop / maxScroll));
    progress.style.width = (ratio * 100).toFixed(2) + "%";
  }

  function getPanel(target) {
    return stage.querySelector('.project-panel[data-panel="' + target + '"]');
  }

  function syncThemeMeta(isDark) {
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", isDark ? "#0a0a0f" : "#f7f8fc");
  }

  function markFocused(item, focused) {
    if (focused) {
      item.classList.add("is-focused");
    } else {
      item.classList.remove("is-focused");
    }
  }

  function enterProjectSingleMode() {
    // 三个项目子页均使用各自的沉浸式深色设计；主页面的主题状态只在返回时恢复。
    document.body.classList.add("project-subpage-mode");
    if (forcedThemeBeforeProject === null) {
      forcedThemeBeforeProject = document.documentElement.classList.contains("dark");
    }
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light-mode");
    document.documentElement.removeAttribute("data-theme");
    syncThemeMeta(true);
  }

  function leaveProjectSingleMode() {
    document.body.classList.remove("project-subpage-mode");
    // Dark mode is the only supported site theme; never restore a light state.
    document.documentElement.classList.add("dark");
    syncThemeMeta(true);
    forcedThemeBeforeProject = null;
  }

  var aiPanel = getPanel("ai");
  var aiCards = aiPanel ? Array.prototype.slice.call(aiPanel.querySelectorAll(".ai-project-card")) : [];
  var aiCardObserver = null;

  panels.forEach(function (panel) {
    panel.addEventListener("scroll", function () {
      updatePanelProgress(panel);
    }, { passive: true });
  });

  aiCards.forEach(function (card, index) {
    var revealDelay = index === 0 ? 0 : (index - 1) * 0.04;
    card.style.setProperty("--reveal-delay", revealDelay.toFixed(2) + "s");
  });

  function disconnectAiCardObserver() {
    if (!aiCardObserver) return;
    aiCardObserver.disconnect();
    aiCardObserver = null;
  }

  function resetAiCardReveal() {
    disconnectAiCardObserver();
    aiCards.forEach(function (card) {
      card.classList.remove("is-visible");
    });
  }

  function setupAiCardReveal() {
    if (!aiCards.length) return;
    resetAiCardReveal();

    if (!("IntersectionObserver" in window)) {
      aiCards.forEach(function (card) {
        card.classList.add("is-visible");
      });
      return;
    }

    aiCardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          aiCardObserver.unobserve(entry.target);
        });
      },
      {
        root: aiPanel,
        threshold: 0.01,
        rootMargin: "0px 0px 18% 0px"
      }
    );

    aiCards.forEach(function (card) {
      aiCardObserver.observe(card);
    });

    // Lightweight pointer tilt: keeps the card feeling physical without
    // interfering with scrolling or touch gestures.
    aiCards.forEach(function (card) {
      if (card.dataset.tiltBound === "true") return;
      card.dataset.tiltBound = "true";
      card.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        var py = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        card.style.setProperty("--card-ry", (px * 4.5).toFixed(2) + "deg");
        card.style.setProperty("--card-rx", (py * -4.5).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--card-ry", "0deg");
        card.style.setProperty("--card-rx", "0deg");
      });
    });

    // Keep the first card complete on entry; later cards reveal smoothly on scroll.
    window.requestAnimationFrame(function () {
      if (!aiPanel || !aiPanel.classList.contains("is-active")) return;
      if (aiCards[0]) aiCards[0].classList.add("is-visible");
    });
  }

  function openPanel(target, triggerEl) {
    var panel = getPanel(target);
    if (!panel) return;

    // Touch-capable browsers may emit touchend, pointerup and a synthetic
    // click for the same tap. Ignore duplicate opens while this panel is
    // already active so the transition cannot visibly jump or reset scroll.
    if (stage.classList.contains("is-active") && activePanel === panel) return;

    // 01 uses the same fixed full-screen child page as 02 and 03.
    document.body.classList.remove("project-ai-document-mode");

    // Keep return button reachable by always starting panel at top.
    panel.scrollTop = 0;
    updatePanelProgress(panel);

    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    panels.forEach(function (node) {
      node.classList.remove("is-active", "is-leaving", "ai-opening");
    });

    enterProjectSingleMode();
    if (target === "ai") {
      var rect = triggerEl ? triggerEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
      var originX = rect.left + rect.width / 2;
      var originY = rect.top + rect.height / 2;
      panel.style.setProperty("--origin-x", originX + "px");
      panel.style.setProperty("--origin-y", originY + "px");
      panel.classList.remove("ai-opening");
      void panel.offsetWidth;
      panel.classList.add("ai-opening");
    }

    stage.classList.add("is-active");
    stage.setAttribute("aria-hidden", "false");
    panel.classList.add("is-active");
    window.requestAnimationFrame(function () {
      document.body.classList.add("project-panel-open");
      if (target === "ai") panel.scrollTop = 0;
      updatePanelProgress(panel);
    });
    activePanel = panel;
    document.dispatchEvent(new CustomEvent("project-panel-open", { detail: { target: target } }));
    window.setTimeout(function () { updatePanelProgress(panel); }, 320);

    if (target === "ai") {
      startMatrixRain();
      setupAiCardReveal();
    } else {
      stopMatrixRain();
    }
  }

  function closePanel() {
    var currentPanel = activePanel || stage.querySelector(".project-panel.is-active");
    if (!currentPanel) {
      closeInfiniteCanvas(true);
      stage.classList.remove("is-active");
      stage.setAttribute("aria-hidden", "true");
      document.body.classList.remove("project-panel-open");
      leaveProjectSingleMode();
      return;
    }

    closeInfiniteCanvas(true);
    stopMatrixRain();
    var leavingPanel = currentPanel;
    if (leavingPanel.getAttribute("data-panel") === "ai") {
      resetAiCardReveal();
    }
    leavingPanel.classList.add("is-leaving");
    leavingPanel.classList.remove("is-active");
    activePanel = null;
    document.body.classList.remove("project-panel-open");

    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () {
      panels.forEach(function (node) {
        node.classList.remove("is-active", "is-leaving", "ai-opening");
      });
      stage.classList.remove("is-active");
      stage.setAttribute("aria-hidden", "true");
      leaveProjectSingleMode();
      closeTimer = null;
    }, 560);
  }

  function tryCloseByBackButton(event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return false;
    var backBtn = target.closest(".panel-back");
    if (!backBtn) return false;
    if (!stage.contains(backBtn) || !stage.classList.contains("is-active")) return false;
    event.preventDefault();
    event.stopPropagation();
    closePanel();
    return true;
  }

  entries.forEach(function (entry) {
    var target = entry.getAttribute("data-project-target");
    if (!target) return;

    var touchStartX = 0;
    var touchStartY = 0;
    var lastOpenAt = 0;

    function openFromEntry(event) {
      // Ignore the synthetic click that some mobile browsers dispatch after
      // our touchend handler has already opened the panel.
      var now = Date.now();
      if (now - lastOpenAt < 450) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      lastOpenAt = now;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      openPanel(target, entry);
    }

    entry.addEventListener("mouseenter", function () {
      markFocused(entry, true);
    });

    entry.addEventListener("mouseleave", function () {
      markFocused(entry, false);
    });

    entry.addEventListener("click", function (event) {
      openFromEntry(event);
    });

    // A few iOS/WebView combinations suppress the follow-up click when a
    // card contains an image/scrollable preview.  Handle a short tap directly
    // so 02 and 03 remain reachable on touch devices.
    entry.addEventListener("touchstart", function (event) {
      if (!event.touches || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    entry.addEventListener("touchend", function (event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      var touch = event.changedTouches[0];
      var dx = touch.clientX - touchStartX;
      var dy = touch.clientY - touchStartY;
      var moved = Math.sqrt(dx * dx + dy * dy);
      if (moved > 14) return;
      openFromEntry(event);
    }, { passive: false });

    entry.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "touch") return;
      openFromEntry(event);
    });

    entry.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel(target, entry);
      }
    });
  });

  // Capture touch activation before nested preview images/scroll strips can
  // consume the event. This is the final fallback for mobile browsers that do
  // not synthesize a click on an article element.
  var projectTouchX = 0;
  var projectTouchY = 0;
  document.addEventListener("touchstart", function (event) {
    if (!event.touches || !event.touches.length) return;
    var target = event.target && event.target.closest ? event.target.closest(".concept-item[data-project-target]") : null;
    if (!target || !hub.contains(target)) return;
    projectTouchX = event.touches[0].clientX;
    projectTouchY = event.touches[0].clientY;
  }, { passive: true, capture: true });

  document.addEventListener("touchend", function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;
    var target = event.target && event.target.closest ? event.target.closest(".concept-item[data-project-target]") : null;
    if (!target || !hub.contains(target) || stage.classList.contains("is-active")) return;
    var touch = event.changedTouches[0];
    var dx = touch.clientX - projectTouchX;
    var dy = touch.clientY - projectTouchY;
    if (Math.sqrt(dx * dx + dy * dy) > 18) return;
    var targetName = target.getAttribute("data-project-target");
    if (!getPanel(targetName)) return;
    event.preventDefault();
    event.stopPropagation();
    openPanel(targetName, target);
  }, { passive: false, capture: true });

  backButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      tryCloseByBackButton(event);
    });
  });

  // Delegated fallback: ensure back actions work even if nested nodes are clicked.
  stage.addEventListener("click", function (event) {
    tryCloseByBackButton(event);
  });

  // Capture-phase fallback: guarantees the back action even with complex overlays.
  document.addEventListener(
    "click",
    function (event) {
      tryCloseByBackButton(event);
    },
    true
  );

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!activePanel) return;
    var canvasOverlay = document.getElementById("infiniteCanvasOverlay");
    if (canvasOverlay && canvasOverlay.classList.contains("is-open")) {
      if (isCanvasLightboxOpen()) {
        closeCanvasLightbox();
        return;
      }
      closeInfiniteCanvas(true);
      return;
    }
    closePanel();
  });

  /* Matrix rain ---------------------------------------------------------- */
  var matrixCanvas = document.getElementById("matrixCanvas");
  var matrixCtx = matrixCanvas ? matrixCanvas.getContext("2d") : null;
  var matrixRaf = 0;
  var matrixHeads = [];
  var matrixSpeeds = [];
  var matrixLeadLengths = [];
  var matrixFontSize = 14;
  var matrixRows = 0;
  var matrixBaseSpeed = 1;
  var matrixTailLength = 24;
  var matrixLastTime = 0;
  var matrixFrameInterval = 1000 / 28;
  var matrixChars = "0123456789ABCDEF";
  var matrixReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function resizeMatrix() {
    if (!matrixCanvas || !matrixCtx) return;
    var viewportW = window.innerWidth;
    var viewportH = window.innerHeight;
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    matrixFontSize = viewportW < 768 ? 18 : viewportW < 1024 ? 16 : 14;
    matrixBaseSpeed = viewportW < 768 ? 0.82 : 1;
    matrixFrameInterval = 1000 / (viewportW < 768 ? 22 : 28);
    matrixCanvas.width = Math.floor(viewportW * dpr);
    matrixCanvas.height = Math.floor(viewportH * dpr);
    matrixCanvas.style.width = viewportW + "px";
    matrixCanvas.style.height = viewportH + "px";
    matrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cols = Math.max(1, Math.floor(viewportW / matrixFontSize));
    matrixRows = Math.max(1, Math.ceil(viewportH / matrixFontSize));
    matrixHeads = [];
    matrixSpeeds = [];
    matrixLeadLengths = [];
    for (var i = 0; i < cols; i += 1) {
      matrixHeads[i] = Math.random() * matrixRows - matrixRows;
      matrixSpeeds[i] = matrixBaseSpeed * (0.7 + Math.random() * 0.6);
      matrixLeadLengths[i] = 1 + Math.floor(Math.random() * 3);
    }
  }

  function drawMatrix(timestamp) {
    if (!matrixCanvas || !matrixCtx) return;
    if (!timestamp) timestamp = 0;

    if (timestamp - matrixLastTime < matrixFrameInterval) {
      matrixRaf = window.requestAnimationFrame(drawMatrix);
      return;
    }
    matrixLastTime = timestamp;

    // Use a translucent wash instead of an opaque black frame so the shared
    // ambient background can flow through the 01 child page.
    matrixCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    matrixCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
    matrixCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    matrixCtx.textAlign = "center";
    matrixCtx.textBaseline = "top";
    var normalFont = '500 ' + matrixFontSize + 'px "JetBrains Mono", "Fira Code", monospace';
    var leadFont = '700 ' + matrixFontSize + 'px "JetBrains Mono", "Fira Code", monospace';

    for (var i = 0; i < matrixHeads.length; i += 1) {
      var x = i * matrixFontSize + matrixFontSize * 0.5;
      var head = matrixHeads[i];
      var leadLength = matrixLeadLengths[i] || 1;
      for (var t = 0; t < matrixTailLength; t += 1) {
        var row = Math.floor(head) - t;
        if (row < -2 || row > matrixRows + 2) continue;
        var y = row * matrixFontSize;
        var glyph = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        var alpha = 1;

        if (t < leadLength) {
          matrixCtx.font = leadFont;
        } else {
          matrixCtx.font = normalFont;
          var fade = 1 - (t - leadLength) / Math.max(1, matrixTailLength - leadLength);
          var randomAlpha = 0.08 + Math.random() * 0.38;
          alpha = Math.max(0.08, Math.min(0.48, randomAlpha * fade));
        }

        matrixCtx.fillStyle = "rgba(95, 221, 171, " + alpha.toFixed(3) + ")";
        matrixCtx.fillText(glyph, x, y);
      }

      matrixHeads[i] += matrixSpeeds[i];
      if (matrixHeads[i] - matrixTailLength > matrixRows + 4) {
        matrixHeads[i] = -Math.random() * matrixRows;
        matrixSpeeds[i] = matrixBaseSpeed * (0.7 + Math.random() * 0.6);
        matrixLeadLengths[i] = 1 + Math.floor(Math.random() * 3);
      }
    }

    // In reduced-motion mode render one quiet frame and do not keep a
    // continuously updating code-rain loop running.
    if (matrixReducedMotion.matches) {
      matrixRaf = 0;
      return;
    }
    matrixRaf = window.requestAnimationFrame(drawMatrix);
  }

  function startMatrixRain() {
    if (!matrixCanvas || !matrixCtx || matrixRaf) return;
    resizeMatrix();
    matrixLastTime = 0;
    drawMatrix(matrixReducedMotion.matches ? 1000 : undefined);
  }

  function stopMatrixRain() {
    if (!matrixCanvas || !matrixCtx) return;
    if (matrixRaf) {
      window.cancelAnimationFrame(matrixRaf);
      matrixRaf = 0;
    }
    matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  }

  window.addEventListener("resize", function () {
    if (matrixRaf) {
      resizeMatrix();
    } else if (matrixReducedMotion.matches && aiPanel && aiPanel.classList.contains("is-active")) {
      resizeMatrix();
      matrixLastTime = 0;
      drawMatrix(1000);
    }
    handleCanvasResize();
  });

  /* Infinite canvas ------------------------------------------------------ */
  var canvasOverlay = document.getElementById("infiniteCanvasOverlay");
  var canvasEnterBtn = document.getElementById("canvasEnterBtn");
  var canvasArrowBtn = document.querySelector(".launch-arrow");
  var canvasCloseBtn = document.getElementById("canvasCloseBtn");
  // The canvas is a child view of project 02, so make the hierarchy explicit
  // in the return control instead of implying a jump back to the resume home.
  if (canvasCloseBtn) {
    canvasCloseBtn.textContent = "< 返回简历";
    canvasCloseBtn.setAttribute("aria-label", "返回简历首页");
  }
  var canvasViewport = document.getElementById("canvasViewport");
  var canvasWorld = document.getElementById("canvasWorld");
  var seededWorld = false;
  var seedingPromise = null;
  var canvasSourceCache = [];
  var canvasLightbox = null;
  var canvasLightboxImage = null;
  var canvasLightboxClose = null;
  var lightboxSourceEl = null;
  var lightboxAnimating = false;

  function toPublicAssetUrl(src) {
    try {
      return new URL(src, document.baseURI).href;
    } catch (error) {
      return src;
    }
  }

  function ensureCanvasMarquee() {
    if (!canvasOverlay) return;
    var label = "DRAG →";
    var existing = canvasOverlay.querySelectorAll(".canvas-marquee");
    Array.prototype.forEach.call(existing, function (bar) {
      bar.parentNode.removeChild(bar);
    });

    function fillTrack(track) {
      var copy;
      var i;
      for (copy = 0; copy < 2; copy += 1) {
        for (i = 0; i < 16; i += 1) {
          var item = document.createElement("span");
          item.textContent = label;
          track.appendChild(item);
        }
      }
    }

    [
      { className: "marquee-top" },
      { className: "marquee-bottom" }
    ].forEach(function (config) {
      var bar = document.createElement("div");
      bar.className = "canvas-marquee " + config.className;
      bar.setAttribute("aria-hidden", "true");
      var track = document.createElement("div");
      track.className = "canvas-marquee-track";
      fillTrack(track);
      bar.appendChild(track);
      canvasOverlay.appendChild(bar);
    });
  }

  var dragState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    zoomBase: 1,
    zoomMin: 0.9,
    zoomMax: 1.9,
    dragZoomBoost: 0,
    pointerZoomBoost: 0,
    visualScale: 1,
    scale: 1,
    targetScale: 1,
    scaleRaf: 0,
    depthRaf: 0,
    cards: [],
    focusX: window.innerWidth * 0.5,
    focusY: window.innerHeight * 0.5,
    parallaxTargetX: 0,
    parallaxTargetY: 0,
    parallaxX: 0,
    parallaxY: 0,
    pointerActive: false,
    pointerDecayTimer: 0,
    pinchActive: false,
    pinchStartDist: 0,
    pinchStartZoom: 1,
    touchZoomActive: false,
    touchZoomStartY: 0,
    touchZoomStartBase: 1,
    touchZoomLastY: 0,
    lockAxisX: false,
    lockedX: 0,
    layers: [],
    pressScale: 1,
    pressTarget: 1,
    orderSeed: Date.now(),
    orderCycle: 0,
    loopEnabled: false,
    tileW: 0,
    tileH: 0,
    loopCenterX: 0,
    loopCenterY: 0,
    columnLoop: false,
    columnPeriod: 0,
    columnCount: 0,
    columnWrapping: false,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    hardMinX: 0,
    hardMaxX: 0,
    hardMinY: 0,
    hardMaxY: 0,
    dragging: false,
    moved: false,
    lastX: 0,
    lastY: 0,
    lastMoveTime: 0,
    velocitySamples: [],
    inertiaRaf: 0,
    settleRaf: 0,
    dragInputType: "",
    suppressClickUntil: 0
  };

  function isMobileCanvasMode() {
    // Column gallery on every viewport: images stack between the red rails.
    return true;
  }

  function isTabletCanvasMode() {
    return window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrapAxis(value, period, center) {
    if (!period) return value;
    return value - period * Math.round((value - center) / period);
  }

  function getLoopMetrics() {
    if (!dragState.loopEnabled || dragState.tileW <= 0 || dragState.tileH <= 0) return null;
    var viewport = getViewportSize();
    var effectiveScale = dragState.scale;
    var periodX = dragState.tileW * effectiveScale;
    var periodY = dragState.tileH * effectiveScale;
    return {
      periodX: periodX,
      periodY: periodY,
      centerX: Math.round((viewport.w - periodX) / 2 - periodX),
      centerY: Math.round((viewport.h - periodY) / 2 - periodY)
    };
  }

  function pseudoRandom(seed) {
    var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function randomInRange(seed, min, max) {
    return min + pseudoRandom(seed) * (max - min);
  }

  function deterministicShuffle(list, seed) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var rand = pseudoRandom(seed + i * 3.31);
      var j = Math.floor(rand * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function getCanvasTargetCount(imageCount) {
    // Keep dense visual population while staying 3-column friendly.
    var target = clamp(imageCount, 18, 21);
    var remainder = target % 3;
    if (remainder !== 0) target -= remainder;
    return Math.max(18, target);
  }

  function buildBalancedCanvasSequence(pool, targetCount, seed) {
    if (!pool.length) return [];
    var usageBySrc = {};
    var sequence = [];
    var recent = [];
    var randomStep = 0;
    var shortCooldown = Math.min(4, Math.max(1, pool.length - 1));

    function seededRand() {
      randomStep += 1;
      return pseudoRandom(seed + randomStep * 17.317);
    }

    pool.forEach(function (item) {
      usageBySrc[item.src] = 0;
    });

    for (var i = 0; i < targetCount; i += 1) {
      var prev = sequence.length ? sequence[sequence.length - 1].src : "";
      var candidates = pool.filter(function (item) {
        if (pool.length > 1 && item.src === prev) return false;
        if (pool.length > 2 && recent.indexOf(item.src) !== -1) return false;
        return true;
      });

      // Relax constraints progressively if source set is too small.
      if (!candidates.length) {
        candidates = pool.filter(function (item) {
          return !(pool.length > 1 && item.src === prev);
        });
      }
      if (!candidates.length) {
        candidates = pool.slice();
      }

      var minUsage = Infinity;
      for (var c = 0; c < candidates.length; c += 1) {
        minUsage = Math.min(minUsage, usageBySrc[candidates[c].src] || 0);
      }
      var fairCandidates = candidates.filter(function (item) {
        return (usageBySrc[item.src] || 0) === minUsage;
      });

      var pick = fairCandidates[Math.floor(seededRand() * fairCandidates.length)];
      sequence.push(pick);
      usageBySrc[pick.src] = (usageBySrc[pick.src] || 0) + 1;

      recent.push(pick.src);
      if (recent.length > shortCooldown) recent.shift();
    }

    return sequence;
  }

  function normalizeCanvasSources(paths) {
    var clean = (paths || [])
      .map(function (src) {
        return String(src || "").trim();
      })
      .filter(Boolean);

    var seenNames = {};
    var deduped = clean.filter(function (src) {
      var rawName = src.split("/").pop().split("?")[0].split("#")[0];
      var key;
      try {
        key = decodeURIComponent(rawName).toLocaleLowerCase();
      } catch (error) {
        key = rawName.toLocaleLowerCase();
      }
      if (seenNames[key]) return false;
      seenNames[key] = true;
      return true;
    });

    deduped.sort(function (a, b) {
      var nameA = a.split("/").pop().split("?")[0].split("#")[0];
      var nameB = b.split("/").pop().split("?")[0].split("#")[0];
      return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
    });

    return deduped;
  }

  function getPptCanvasSources() {
    var fromGlobal = Array.isArray(window.__pptDesignImages) ? window.__pptDesignImages.filter(Boolean) : [];
    if (fromGlobal.length) return Promise.resolve(normalizeCanvasSources(fromGlobal));

    if (typeof window.ensurePptGalleryLoaded === "function") {
      return window.ensurePptGalleryLoaded()
        .then(function (paths) {
          return normalizeCanvasSources(paths || []);
        })
        .catch(function () {
          return [];
        });
    }

    var fromDom = Array.prototype.slice
      .call(document.querySelectorAll(".ppt-media img"))
      .map(function (img) {
        return img.currentSrc || img.src;
      })
      .filter(Boolean);
    return Promise.resolve(normalizeCanvasSources(fromDom));
  }

  function loadImageMeta(src) {
    return new Promise(function (resolve) {
      var probe = new Image();
      probe.onload = function () {
        var ratio = probe.naturalWidth && probe.naturalHeight ? probe.naturalWidth / probe.naturalHeight : 16 / 9;
        resolve({ src: src, ratio: ratio });
      };
      probe.onerror = function () {
        resolve({ src: src, ratio: 16 / 9 });
      };
      probe.src = toPublicAssetUrl(src);
    });
  }

  function getViewportSize() {
    return {
      w: canvasViewport ? canvasViewport.clientWidth : window.innerWidth,
      h: canvasViewport ? canvasViewport.clientHeight : window.innerHeight
    };
  }

  function updateCanvasScaleTarget() {
    var wanted = dragState.zoomBase + dragState.dragZoomBoost + dragState.pointerZoomBoost;
    dragState.targetScale = clamp(wanted, dragState.zoomMin, dragState.zoomMax);
  }

  function setCanvasFocus(clientX, clientY) {
    var viewport = getViewportSize();
    dragState.focusX = dragState.lockAxisX ? viewport.w * 0.5 : clientX;
    dragState.focusY = clientY;
    if (canvasOverlay) {
      canvasOverlay.style.setProperty("--focus-x", Math.round(dragState.focusX) + "px");
      canvasOverlay.style.setProperty("--focus-y", Math.round(clientY) + "px");
    }
  }

  function setCanvasZoomAtPoint(nextZoom, clientX, clientY) {
    var zoom = clamp(nextZoom, dragState.zoomMin, dragState.zoomMax);
    var prevZoom = dragState.zoomBase;
    if (Math.abs(zoom - prevZoom) < 0.0001) return;

    var viewport = getViewportSize();
    var anchorX = typeof clientX === "number" ? clientX : viewport.w * 0.5;
    var anchorY = typeof clientY === "number" ? clientY : viewport.h * 0.5;
    dragState.x = anchorX - ((anchorX - dragState.x) * zoom) / prevZoom;
    dragState.y = anchorY - ((anchorY - dragState.y) * zoom) / prevZoom;
    setCanvasFocus(anchorX, anchorY);

    dragState.zoomBase = zoom;
    updateCanvasScaleTarget();
    if (!dragState.scaleRaf) {
      dragState.scaleRaf = window.requestAnimationFrame(tickCanvasScale);
    } else {
      syncCanvasTransform();
    }
  }

  function prepareCanvasItems(items) {
    if (!items.length) return [];
    var sourcePool = deterministicShuffle(items.slice(), dragState.orderSeed * 0.31 + dragState.orderCycle * 1.77);
    // Display every unique work exactly once. The previous 18–21 item target
    // duplicated a small gallery and could silently omit works in a large one.
    return sourcePool;
  }

  function buildCardTypePlan(total) {
    var largeCount = clamp(Math.round(total * 0.28), 5, 6);
    var smallCount = clamp(Math.round(total * 0.24), 4, 6);
    var mediumCount = total - largeCount - smallCount;

    if (mediumCount < 8) {
      var deficit = 8 - mediumCount;
      while (deficit > 0 && smallCount > 4) {
        smallCount -= 1;
        deficit -= 1;
      }
      while (deficit > 0 && largeCount > 5) {
        largeCount -= 1;
        deficit -= 1;
      }
      mediumCount = total - largeCount - smallCount;
    }

    var plan = [];
    for (var i = 0; i < largeCount; i += 1) plan.push("large");
    for (var j = 0; j < mediumCount; j += 1) plan.push("medium");
    for (var k = 0; k < smallCount; k += 1) plan.push("small");
    return deterministicShuffle(plan, total * 2.91);
  }

  function getCardAngle(type, seed) {
    if (type === "large") return randomInRange(seed + 0.1, -1, 1);
    if (type === "small") return randomInRange(seed + 0.2, -2.5, 2.5);
    return randomInRange(seed + 0.3, -2, 2);
  }

  function getCardWidth(type, scale, seed) {
    if (type === "large") return Math.round(randomInRange(seed + 1, 460, 520) * scale);
    if (type === "small") return Math.round(randomInRange(seed + 2, 220, 280) * scale);
    return Math.round(randomInRange(seed + 3, 320, 380) * scale);
  }

  function cardsOverlap(a, b, gap) {
    return !(
      a.x + a.w + gap <= b.x ||
      b.x + b.w + gap <= a.x ||
      a.y + a.h + gap <= b.y ||
      b.y + b.h + gap <= a.y
    );
  }

  function getCanvasCardBox(type, scale) {
    if (type === "large") return { w: Math.round(500 * scale), h: Math.round(350 * scale) };
    if (type === "small") return { w: Math.round(250 * scale), h: Math.round(350 * scale) };
    return { w: Math.round(350 * scale), h: Math.round(250 * scale) };
  }

  function buildDesktopLayout(items) {
    var tablet = isTabletCanvasMode();
    var prepared = items.slice();
    var worldW = 4000;
    var worldH = 3000;
    var scale = tablet ? 0.82 : 1;
    var pad = tablet ? 72 : 96;
    var gap = tablet ? 28 : 36;
    var typePlan = buildCardTypePlan(prepared.length);
    var cards = [];

    for (var i = 0; i < prepared.length; i += 1) {
      var type = typePlan[i] || "medium";
      var box = getCanvasCardBox(type, scale);
      var placed = false;
      var card = null;
      for (var attempt = 0; attempt < 90; attempt += 1) {
        var seed = (i + 1) * 19.17 + attempt * 7.31 + dragState.orderSeed * 0.0001;
        var x = Math.round(randomInRange(seed, pad, Math.max(pad, worldW - box.w - pad)));
        var y = Math.round(randomInRange(seed + 4.2, pad, Math.max(pad, worldH - box.h - pad)));
        card = {
          src: prepared[i].src,
          ratio: prepared[i].ratio || 16 / 9,
          x: x,
          y: y,
          w: box.w,
          h: box.h,
          angle: getCardAngle(type, seed),
          layer: type === "small" ? 0 : 1,
          type: type
        };
        var hits = false;
        for (var p = 0; p < cards.length; p += 1) {
          if (cardsOverlap(card, cards[p], gap)) {
            hits = true;
            break;
          }
        }
        if (!hits) {
          placed = true;
          break;
        }
      }
      if (!placed && card) {
        var col = i % 4;
        var row = Math.floor(i / 4);
        card.x = pad + col * Math.round((worldW - pad * 2 - box.w) / 3);
        card.y = pad + row * (box.h + gap);
      }
      cards.push(card);
    }

    return {
      cards: cards,
      worldW: worldW,
      worldH: worldH
    };
  }

  function clearCanvasWorld() {
    if (!canvasWorld) return;
    canvasWorld.innerHTML = "";
  }

  function renderCanvasPlaceholder(text) {
    if (!canvasWorld) return;
    clearCanvasWorld();
    canvasWorld.innerHTML = '<div class="canvas-loading">' + text + "</div>";
  }

  function resetCanvasCardTilt(card) {
    if (!card) return;
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  function bindCanvasCardTilt(card) {
    if (!card || isMobileCanvasMode()) return;
    card.addEventListener("pointermove", function (event) {
      if (dragState.dragging || isCanvasLightboxOpen()) return;
      var rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      var ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      card.classList.add("is-tilting");
      card.style.setProperty("--tilt-x", (-ny * 8).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", (nx * 8).toFixed(2) + "deg");
    });
    card.addEventListener("pointerleave", function () {
      resetCanvasCardTilt(card);
    });
  }

  function createCanvasCard(cardData, mobileMode) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "canvas-thumb";
    var layer = typeof cardData.layer === "number" ? cardData.layer : 1;
    card.dataset.layer = String(layer);
    card.dataset.cx = String(cardData.x + cardData.w * 0.5);
    card.dataset.cy = String(cardData.y + cardData.h * 0.5);
    card.style.position = mobileMode ? "relative" : "absolute";
    card.style.left = mobileMode ? "auto" : cardData.x + "px";
    card.style.top = mobileMode ? "auto" : cardData.y + "px";
    card.style.width = cardData.w + "px";
    card.style.height = cardData.h + "px";
    card.style.setProperty("--angle", mobileMode ? "0deg" : cardData.angle.toFixed(2) + "deg");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");

    var img = document.createElement("img");
    img.src = toPublicAssetUrl(cardData.src);
    img.alt = "PPT作品缩略图";
    img.onerror = function () {
      // Retry once with the original relative URL for older WebViews whose
      // URL parser mishandles encoded non-ASCII filenames.
      if (img.dataset.assetRetry === "true") return;
      img.dataset.assetRetry = "true";
      img.src = cardData.src;
    };
    // The mobile canvas renders three vertically-looped copies.  Lazy loading
    // can incorrectly treat the first/second copy as permanently off-screen
    // on iOS/WebView browsers, leaving the visible cards blank after the loop
    // jumps the scroll position.  Eager loading is safe here (the source set
    // is intentionally small) and guarantees the canvas is immediately
    // populated on touch devices.
    img.loading = mobileMode ? "eager" : "lazy";
    if (mobileMode && "fetchPriority" in img) img.fetchPriority = "high";
    img.decoding = "async";
    img.draggable = false;
    card.appendChild(img);
    if (!mobileMode) bindCanvasCardTilt(card);

    return card;
  }

  function updateCanvasBounds() {
    if (!canvasWorld || !canvasViewport || isMobileCanvasMode()) {
      dragState.loopEnabled = false;
      dragState.tileW = 0;
      dragState.tileH = 0;
      dragState.loopCenterX = 0;
      dragState.loopCenterY = 0;
      dragState.minX = 0;
      dragState.maxX = 0;
      dragState.minY = 0;
      dragState.maxY = 0;
      dragState.hardMinX = 0;
      dragState.hardMaxX = 0;
      dragState.hardMinY = 0;
      dragState.hardMaxY = 0;
      return;
    }

    var viewport = getViewportSize();
    if (dragState.loopEnabled && dragState.tileW > 0 && dragState.tileH > 0) {
      dragState.loopCenterX = Math.round((viewport.w - dragState.tileW) / 2 - dragState.tileW);
      dragState.loopCenterY = Math.round((viewport.h - dragState.tileH) / 2 - dragState.tileH);
      return;
    }

    var worldW = canvasWorld.offsetWidth;
    var worldH = canvasWorld.offsetHeight;

    if (worldW <= viewport.w) {
      var cx = (viewport.w - worldW) / 2;
      dragState.minX = cx;
      dragState.maxX = cx;
      dragState.hardMinX = cx;
      dragState.hardMaxX = cx;
    } else {
      dragState.minX = viewport.w - worldW;
      dragState.maxX = 0;
      dragState.hardMinX = dragState.minX - viewport.w * 0.3;
      dragState.hardMaxX = dragState.maxX + viewport.w * 0.3;
    }

    if (worldH <= viewport.h) {
      var cy = (viewport.h - worldH) / 2;
      dragState.minY = cy;
      dragState.maxY = cy;
      dragState.hardMinY = cy;
      dragState.hardMaxY = cy;
    } else {
      dragState.minY = viewport.h - worldH;
      dragState.maxY = 0;
      dragState.hardMinY = dragState.minY - viewport.h * 0.3;
      dragState.hardMaxY = dragState.maxY + viewport.h * 0.3;
    }
  }

  function applyCanvasTransform(skipDepth) {
    if (!canvasWorld) return;
    var tx = dragState.x;
    var ty = dragState.y;
    var visualScale = dragState.scale * dragState.pressScale;
    dragState.visualScale = visualScale;
    if (dragState.loopEnabled) {
      tx = Math.round(tx);
      ty = Math.round(ty);
    }
    if (dragState.layers && dragState.layers.length && !isMobileCanvasMode()) {
      canvasWorld.style.transform =
        "translate3d(" + tx + "px, " + ty + "px, 0) scale(" + visualScale + ")";
      for (var i = 0; i < dragState.layers.length; i += 1) {
        var layerEl = dragState.layers[i];
        var depth = Number(layerEl.dataset.depth || 1);
        layerEl.style.transform =
          "translate3d(" +
          (tx * (depth - 1)).toFixed(2) +
          "px, " +
          (ty * (depth - 1)).toFixed(2) +
          "px, 0)";
      }
    } else {
      canvasWorld.style.transform =
        "translate3d(" + tx + "px, " + ty + "px, 0) scale(" + visualScale + ")";
    }
    if (!skipDepth) requestDepthRender();
  }

  function renderCanvasDepthFrame() {
    dragState.depthRaf = 0;
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open")) return;
    if (!canvasWorld || !dragState.cards.length || isMobileCanvasMode()) return;

    var viewport = getViewportSize();
    var maxDist = Math.max(420, Math.hypot(viewport.w * 0.6, viewport.h * 0.58));
    var zoomImpact = clamp((dragState.scale - 1) / 0.9, 0, 1);
    var pressDiff = dragState.pressTarget - dragState.pressScale;
    if (Math.abs(pressDiff) > 0.001) {
      dragState.pressScale += pressDiff * 0.22;
      applyCanvasTransform(true);
    } else {
      dragState.pressScale = dragState.pressTarget;
    }

    for (var i = 0; i < dragState.cards.length; i += 1) {
      var card = dragState.cards[i];
      var baseCx = Number(card.dataset.cx || 0);
      var baseCy = Number(card.dataset.cy || 0);
      var layer = Number(card.dataset.layer || 1);
      var depth = layer === 0 ? 0.35 : 1;
      var screenX = dragState.x * depth + baseCx * dragState.scale;
      var screenY = dragState.y * depth + baseCy * dragState.scale;
      var dist = Math.hypot(screenX - dragState.focusX, screenY - dragState.focusY);
      var focus = clamp(1 - dist / maxDist, 0, 1);
      var cardScale = 0.97 + focus * 0.08 + zoomImpact * 0.1 * depth;
      var cardBlur = (1 - focus) * (0.35 + (1 - depth) * 0.9);
      var cardBrightness = 0.78 + focus * 0.24 + depth * 0.08;
      var cardDim = 0.88 + focus * 0.18;
      var borderAlpha = clamp(0.05 + zoomImpact * 0.16 + focus * 0.04, 0.05, 0.28);
      var shadowY = 16 + zoomImpact * 18 + focus * 6;
      var shadowBlur = 40 + zoomImpact * 26 + focus * 8;
      var shadowNearY = 4 + zoomImpact * 6 + focus * 2;
      var shadowNearBlur = 12 + zoomImpact * 10 + focus * 4;
      var shadowFarAlpha = clamp(0.65 + zoomImpact * 0.14 + focus * 0.06, 0.64, 0.9);
      var shadowNearAlpha = clamp(0.4 + zoomImpact * 0.1 + focus * 0.05, 0.4, 0.72);

      card.style.setProperty("--card-scale", cardScale.toFixed(4));
      card.style.setProperty("--card-blur", cardBlur.toFixed(3) + "px");
      card.style.setProperty("--card-bright", cardBrightness.toFixed(4));
      card.style.setProperty("--card-dim", cardDim.toFixed(4));
      card.style.setProperty("--card-border-alpha", borderAlpha.toFixed(3));
      card.style.setProperty(
        "--card-shadow",
        "0 " +
          shadowY.toFixed(1) +
          "px " +
          shadowBlur.toFixed(1) +
          "px rgba(0, 0, 0, " +
          shadowFarAlpha.toFixed(3) +
          "), 0 " +
          shadowNearY.toFixed(1) +
          "px " +
          shadowNearBlur.toFixed(1) +
          "px rgba(0, 0, 0, " +
          shadowNearAlpha.toFixed(3) +
          ")"
      );
      card.style.zIndex = String(Math.round(20 + focus * 80 + layer * 18));
    }

    if (canvasOverlay) {
      var glowStrength = (zoomImpact * 0.72 + Math.hypot(dragState.x, dragState.y) / 2400) * 0.5;
      var gridAlpha = clamp(0.06 + zoomImpact * 0.14, 0.06, 0.22);
      canvasOverlay.style.setProperty("--zoom-glow", glowStrength.toFixed(3));
      canvasOverlay.style.setProperty("--grid-alpha", gridAlpha.toFixed(3));
      canvasOverlay.style.setProperty("--grid-shift-x", (dragState.x * 0.08).toFixed(2) + "px");
      canvasOverlay.style.setProperty("--grid-shift-y", (dragState.y * 0.08).toFixed(2) + "px");
    }

    if (Math.abs(pressDiff) > 0.001) {
      requestDepthRender();
    }
  }

  function requestDepthRender() {
    if (dragState.depthRaf) return;
    dragState.depthRaf = window.requestAnimationFrame(renderCanvasDepthFrame);
  }

  function stopDepthRender() {
    if (dragState.depthRaf) {
      window.cancelAnimationFrame(dragState.depthRaf);
      dragState.depthRaf = 0;
    }
  }

  function stopWheelShock() {
    if (canvasOverlay) {
      // Keep pulse vars deterministic in continuous-zoom mode.
      canvasOverlay.style.setProperty("--wheel-pulse", "0");
      canvasOverlay.style.setProperty("--wheel-shift-y", "0px");
    }
  }

  function stopCanvasScaleAnimation() {
    if (dragState.scaleRaf) {
      window.cancelAnimationFrame(dragState.scaleRaf);
      dragState.scaleRaf = 0;
    }
  }

  function tickCanvasScale() {
    var diff = dragState.targetScale - dragState.scale;
    if (Math.abs(diff) < 0.0015) {
      dragState.scale = dragState.targetScale;
      dragState.scaleRaf = 0;
      applyCanvasTransform();
      return;
    }
    dragState.scale += diff * 0.14;
    applyCanvasTransform();
    dragState.scaleRaf = window.requestAnimationFrame(tickCanvasScale);
  }

  function setCanvasTargetScale(nextScale) {
    dragState.targetScale = clamp(nextScale, dragState.zoomMin, dragState.zoomMax);
    if (!dragState.scaleRaf) {
      dragState.scaleRaf = window.requestAnimationFrame(tickCanvasScale);
    }
    requestDepthRender();
  }

  function syncCanvasTransform() {
    if (!canvasWorld) return;
    var loop = getLoopMetrics();
    if (loop) {
      dragState.x = dragState.lockAxisX ? loop.centerX : wrapAxis(dragState.x, loop.periodX, loop.centerX);
      dragState.y = wrapAxis(dragState.y, loop.periodY, loop.centerY);
      applyCanvasTransform();
      return;
    }
    dragState.x = clamp(dragState.x, dragState.hardMinX, dragState.hardMaxX);
    dragState.y = clamp(dragState.y, dragState.hardMinY, dragState.hardMaxY);
    applyCanvasTransform();
  }

  function renderDesktopWorld(items) {
    if (!canvasWorld) return;
    clearCanvasWorld();
    var layout = buildDesktopLayout(items);
    var depths = [0.35, 1];
    var layerNames = ["far", "near"];

    canvasWorld.style.position = "absolute";
    canvasWorld.style.display = "block";
    canvasWorld.style.gridTemplateColumns = "";
    canvasWorld.style.justifyItems = "";
    canvasWorld.style.rowGap = "";
    canvasWorld.style.width = layout.worldW + "px";
    canvasWorld.style.height = layout.worldH + "px";

    dragState.layers = [];
    for (var l = 0; l < layerNames.length; l += 1) {
      var layerEl = document.createElement("div");
      layerEl.className = "canvas-layer canvas-layer-" + layerNames[l];
      layerEl.dataset.depth = String(depths[l]);
      canvasWorld.appendChild(layerEl);
      dragState.layers.push(layerEl);
    }

    for (var i = 0; i < layout.cards.length; i += 1) {
      var cardNode = createCanvasCard(layout.cards[i], false);
      var layerIndex = clamp(layout.cards[i].layer, 0, 1);
      dragState.layers[layerIndex].appendChild(cardNode);
    }

    dragState.loopEnabled = false;
    dragState.tileW = 0;
    dragState.tileH = 0;
    updateCanvasBounds();
    var viewport = getViewportSize();
    dragState.x = Math.round((viewport.w - layout.worldW) / 2);
    dragState.y = Math.round((viewport.h - layout.worldH) / 2);
    dragState.vx = 0;
    dragState.vy = 0;
    dragState.zoomBase = 1;
    dragState.dragZoomBoost = 0;
    dragState.pointerZoomBoost = 0;
    dragState.scale = 1;
    dragState.targetScale = 1;
    dragState.pressScale = 1;
    dragState.pressTarget = 1;
    dragState.parallaxX = 0;
    dragState.parallaxY = 0;
    dragState.parallaxTargetX = 0;
    dragState.parallaxTargetY = 0;
    dragState.cards = Array.prototype.slice.call(canvasWorld.querySelectorAll(".canvas-thumb"));
    var viewport = getViewportSize();
    setCanvasFocus(viewport.w * 0.5, viewport.h * 0.5);
    stopCanvasScaleAnimation();
    stopWheelShock();
    syncCanvasTransform();
    requestDepthRender();
  }

  function appendColumnCards(items, columnWidth) {
    items.forEach(function (item) {
      var ratio = clamp(item.ratio || 16 / 9, 0.55, 2.1);
      var height = Math.round(columnWidth / ratio);
      var card = createCanvasCard(
        {
          src: item.src,
          x: 0,
          y: 0,
          w: columnWidth,
          h: height,
          angle: 0
        },
        true
      );
      card.style.margin = "0";
      canvasWorld.appendChild(card);
    });
  }

  function setupColumnLoop(count) {
    dragState.columnLoop = false;
    dragState.columnPeriod = 0;
    dragState.columnCount = 0;
    if (!canvasViewport || !canvasWorld || count < 1) return;

    function measure() {
      if (!canvasWorld || !canvasViewport) return;
      var cards = canvasWorld.querySelectorAll(".canvas-thumb");
      if (cards.length < count * 2) return;
      var period = cards[count].offsetTop - cards[0].offsetTop;
      if (period < 8) {
        window.requestAnimationFrame(measure);
        return;
      }
      dragState.columnLoop = true;
      dragState.columnPeriod = period;
      dragState.columnCount = count;
      dragState.columnWrapping = true;
      canvasViewport.scrollTop = period;
      dragState.columnWrapping = false;
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(measure);
    });
  }

  function handleColumnLoopScroll() {
    if (dragState.columnWrapping || !dragState.columnLoop || !dragState.columnPeriod) return;
    if (!canvasViewport) return;
    var period = dragState.columnPeriod;
    var top = canvasViewport.scrollTop;
    if (top >= period * 2 || top < period) {
      while (top >= period * 2) top -= period;
      while (top < period) top += period;
      dragState.columnWrapping = true;
      canvasViewport.scrollTop = top;
      dragState.columnWrapping = false;
    }
  }

  function renderMobileWorld(items) {
    if (!canvasWorld) return;
    clearCanvasWorld();
    dragState.loopEnabled = false;
    dragState.tileW = 0;
    dragState.tileH = 0;
    dragState.loopCenterX = 0;
    dragState.loopCenterY = 0;
    canvasWorld.style.position = "relative";
    canvasWorld.style.display = "flex";
    canvasWorld.style.flexDirection = "column";
    canvasWorld.style.alignItems = "center";
    canvasWorld.style.gridTemplateColumns = "";
    canvasWorld.style.justifyItems = "center";
    canvasWorld.style.rowGap = "";
    canvasWorld.style.gap = window.innerWidth < 768 ? "16px" : "28px";
    canvasWorld.style.width = "100%";
    canvasWorld.style.height = "auto";
    canvasWorld.style.transform = "none";
    dragState.layers = [];

    var mobileWidth = Math.round(
      window.innerWidth < 768
        ? Math.min(window.innerWidth * 0.85, 460)
        : Math.min(window.innerWidth * 0.72, 720)
    );
    // Three identical columns so the last card meets the first and scrolling can wrap.
    appendColumnCards(items, mobileWidth);
    appendColumnCards(items, mobileWidth);
    appendColumnCards(items, mobileWidth);

    dragState.x = 0;
    dragState.y = 0;
    dragState.vx = 0;
    dragState.vy = 0;
    dragState.zoomBase = 1;
    dragState.dragZoomBoost = 0;
    dragState.pointerZoomBoost = 0;
    dragState.scale = 1;
    dragState.targetScale = 1;
    dragState.cards = [];
    dragState.parallaxX = 0;
    dragState.parallaxY = 0;
    dragState.parallaxTargetX = 0;
    dragState.parallaxTargetY = 0;
    stopCanvasScaleAnimation();
    stopWheelShock();
    stopDepthRender();
    setupColumnLoop(items.length);
  }

  function renderCanvasWorld(items) {
    if (!items.length) {
      renderCanvasPlaceholder("未检测到PPT图片，请确认 assets/images/ppt-design 下存在可访问图片。");
      seededWorld = false;
      return;
    }

    var displayItems = prepareCanvasItems(items);

    if (isMobileCanvasMode()) {
      renderMobileWorld(displayItems);
    } else {
      renderDesktopWorld(displayItems);
    }
    seededWorld = true;
  }

  function ensureCanvasSeeded(forceLayout) {
    if (seededWorld && canvasSourceCache.length && forceLayout) {
      renderCanvasWorld(canvasSourceCache);
      return Promise.resolve();
    }
    if (seededWorld && canvasSourceCache.length) return Promise.resolve();
    if (seedingPromise) return seedingPromise;

    renderCanvasPlaceholder("PPT作品加载中...");
    seedingPromise = getPptCanvasSources()
      .then(function (sources) {
        return Promise.all(sources.map(loadImageMeta));
      })
      .then(function (items) {
        canvasSourceCache = items;
        renderCanvasWorld(canvasSourceCache);
      })
      .catch(function () {
        canvasSourceCache = [];
        renderCanvasPlaceholder("PPT作品加载失败，请稍后重试。");
        seededWorld = false;
      })
      .then(function (items) {
        seedingPromise = null;
        return items;
      });

    return seedingPromise;
  }

  function stopCanvasInertia() {
    if (dragState.inertiaRaf) {
      window.cancelAnimationFrame(dragState.inertiaRaf);
      dragState.inertiaRaf = 0;
    }
  }

  function stopCanvasSettle() {
    if (dragState.settleRaf) {
      window.cancelAnimationFrame(dragState.settleRaf);
      dragState.settleRaf = 0;
    }
  }

  function resetDragTracking() {
    dragState.dragInputType = "";
    dragState.dragging = false;
  }

  function applyRubber(value, min, max, resistance) {
    if (value < min) return min + (value - min) * resistance;
    if (value > max) return max + (value - max) * resistance;
    return value;
  }

  function getDragGain(dx, dy) {
    var speed = Math.hypot(dx, dy);
    if (speed < 1.8) return 0.64;
    if (speed < 4.2) return 0.86;
    if (speed < 10.5) return 1.08;
    return 1.32;
  }

  function pushVelocitySample(vx, vy) {
    dragState.velocitySamples.push({ vx: vx, vy: vy });
    if (dragState.velocitySamples.length > 8) {
      dragState.velocitySamples.shift();
    }
  }

  function computeReleaseVelocity() {
    if (!dragState.velocitySamples.length) return { vx: 0, vy: 0 };
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < dragState.velocitySamples.length; i += 1) {
      sumX += dragState.velocitySamples[i].vx;
      sumY += dragState.velocitySamples[i].vy;
    }
    return {
      vx: sumX / dragState.velocitySamples.length,
      vy: sumY / dragState.velocitySamples.length
    };
  }

  function startSettleToBounds() {
    if (isMobileCanvasMode()) return;
    if (dragState.loopEnabled) {
      dragState.vx = 0;
      dragState.vy = 0;
      syncCanvasTransform();
      return;
    }
    stopCanvasSettle();
    var spring = 0.14;
    var damping = 0.82;

    function frame() {
      var targetX = clamp(dragState.x, dragState.minX, dragState.maxX);
      var targetY = clamp(dragState.y, dragState.minY, dragState.maxY);
      var dx = targetX - dragState.x;
      var dy = targetY - dragState.y;

      dragState.vx += dx * spring;
      dragState.vy += dy * spring;
      dragState.vx *= damping;
      dragState.vy *= damping;
      dragState.x += dragState.vx;
      dragState.y += dragState.vy;
      syncCanvasTransform();

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(dragState.vx) < 0.35 && Math.abs(dragState.vy) < 0.35) {
        dragState.x = targetX;
        dragState.y = targetY;
        dragState.vx = 0;
        dragState.vy = 0;
        syncCanvasTransform();
        dragState.settleRaf = 0;
        return;
      }

      dragState.settleRaf = window.requestAnimationFrame(frame);
    }

    dragState.settleRaf = window.requestAnimationFrame(frame);
  }

  function runCanvasInertia() {
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open") || isMobileCanvasMode()) {
      stopCanvasInertia();
      return;
    }

    if (dragState.lockAxisX) {
      dragState.vx = 0;
    } else {
      dragState.vx *= 0.92;
    }
    dragState.vy *= 0.92;
    dragState.x += dragState.vx;
    dragState.y += dragState.vy;

    if (dragState.loopEnabled) {
      syncCanvasTransform();
      if (Math.abs(dragState.vx) < 0.5 && Math.abs(dragState.vy) < 0.5) {
        stopCanvasInertia();
        dragState.vx = 0;
        dragState.vy = 0;
        return;
      }
      dragState.inertiaRaf = window.requestAnimationFrame(runCanvasInertia);
      return;
    }

    if (dragState.x < dragState.minX || dragState.x > dragState.maxX) {
      var targetX = dragState.x < dragState.minX ? dragState.minX : dragState.maxX;
      dragState.vx += (targetX - dragState.x) * 0.11;
      dragState.vx *= 0.88;
    }
    if (dragState.y < dragState.minY || dragState.y > dragState.maxY) {
      var targetY = dragState.y < dragState.minY ? dragState.minY : dragState.maxY;
      dragState.vy += (targetY - dragState.y) * 0.11;
      dragState.vy *= 0.88;
    }

    dragState.x = clamp(dragState.x, dragState.hardMinX, dragState.hardMaxX);
    dragState.y = clamp(dragState.y, dragState.hardMinY, dragState.hardMaxY);
    if (dragState.x === dragState.hardMinX || dragState.x === dragState.hardMaxX) {
      dragState.vx *= 0.58;
    }
    if (dragState.y === dragState.hardMinY || dragState.y === dragState.hardMaxY) {
      dragState.vy *= 0.58;
    }
    applyCanvasTransform();

    if (Math.abs(dragState.vx) < 0.5 && Math.abs(dragState.vy) < 0.5) {
      stopCanvasInertia();
      startSettleToBounds();
      return;
    }

    dragState.inertiaRaf = window.requestAnimationFrame(runCanvasInertia);
  }

  function startCanvasDrag(inputType, clientX, clientY) {
    if (!canvasWorld || !canvasOverlay || !canvasOverlay.classList.contains("is-open") || isMobileCanvasMode()) return;
    stopCanvasInertia();
    stopCanvasSettle();
    dragState.dragging = true;
    dragState.dragInputType = inputType;
    dragState.moved = false;
    dragState.lastX = clientX;
    dragState.lastY = clientY;
    dragState.lastMoveTime = performance.now();
    dragState.velocitySamples = [];
    dragState.vx = 0;
    dragState.vy = 0;
    dragState.lockedX = dragState.x;
    dragState.suppressClickUntil = Date.now() + 80;
    dragState.dragZoomBoost = 0;
    dragState.pressTarget = 0.98;
    var viewport = getViewportSize();
    setCanvasFocus(clientX, clientY);
    updateCanvasScaleTarget();
    setCanvasTargetScale(dragState.targetScale);
    canvasWorld.classList.add("is-dragging");
    if (canvasViewport) canvasViewport.classList.add("is-grabbing");
  }

  function moveCanvasDrag(clientX, clientY) {
    if (!dragState.dragging || isMobileCanvasMode()) return;
    var now = performance.now();
    var dt = Math.max(1, now - dragState.lastMoveTime);
    var dx = clientX - dragState.lastX;
    var dy = clientY - dragState.lastY;
    dragState.lastX = clientX;
    dragState.lastY = clientY;
    dragState.lastMoveTime = now;

    var gain = getDragGain(dx, dy);
    var moveX = dx * gain;
    var moveY = dy * gain;
    if (dragState.loopEnabled) {
      dragState.x += moveX;
      dragState.y += moveY;
    } else {
      dragState.x = applyRubber(dragState.x + moveX, dragState.minX, dragState.maxX, 0.28);
      dragState.y = applyRubber(dragState.y + moveY, dragState.minY, dragState.maxY, 0.28);
      dragState.x = clamp(dragState.x, dragState.hardMinX, dragState.hardMaxX);
      dragState.y = clamp(dragState.y, dragState.hardMinY, dragState.hardMaxY);
    }

    var frameScale = 16.666 / dt;
    pushVelocitySample(moveX * frameScale, moveY * frameScale);

    if (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8) {
      setCanvasFocus(clientX, clientY);
      dragState.moved = true;
      dragState.suppressClickUntil = Date.now() + 220;
    }
    requestDepthRender();
    syncCanvasTransform();
  }

  function endCanvasDrag() {
    if (!dragState.dragging) return;
    resetDragTracking();
    dragState.dragZoomBoost = 0;
    dragState.pressTarget = 1;
    updateCanvasScaleTarget();
    setCanvasTargetScale(dragState.targetScale);
    requestDepthRender();
    var velocity = computeReleaseVelocity();
    dragState.velocitySamples = [];

    if (dragState.moved) {
      dragState.vx = velocity.vx;
      dragState.vy = velocity.vy;
      runCanvasInertia();
    } else {
      dragState.vx = 0;
      dragState.vy = 0;
      startSettleToBounds();
    }

    window.setTimeout(function () {
      if (canvasWorld) canvasWorld.classList.remove("is-dragging");
      if (canvasViewport) canvasViewport.classList.remove("is-grabbing");
    }, 120);
  }

  function ensureCanvasLightbox() {
    if (canvasLightbox) return;
    canvasLightbox = document.createElement("div");
    canvasLightbox.className = "canvas-lightbox";
    canvasLightbox.innerHTML = [
      '<button class="canvas-lightbox-close" type="button" aria-label="关闭预览"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>',
      '<img class="canvas-lightbox-image" alt="PPT作品放大预览" />'
    ].join("");
    document.body.appendChild(canvasLightbox);
    canvasLightboxImage = canvasLightbox.querySelector(".canvas-lightbox-image");
    canvasLightboxClose = canvasLightbox.querySelector(".canvas-lightbox-close");

    canvasLightboxClose.addEventListener("click", function () {
      closeCanvasLightbox();
    });

    canvasLightbox.addEventListener("click", function (event) {
      if (event.target === canvasLightbox) {
        closeCanvasLightbox();
      }
    });
  }

  function isCanvasLightboxOpen() {
    return !!(canvasLightbox && canvasLightbox.classList.contains("is-active"));
  }

  function getLightboxTargetRect(ratio) {
    var maxW = window.innerWidth * 0.85;
    var maxH = window.innerHeight * 0.85;
    var w = maxW;
    var h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    return {
      left: (window.innerWidth - w) / 2,
      top: (window.innerHeight - h) / 2,
      width: w,
      height: h
    };
  }

  function applyLightboxImageRect(rect, radius) {
    if (!canvasLightboxImage) return;
    canvasLightboxImage.style.left = rect.left + "px";
    canvasLightboxImage.style.top = rect.top + "px";
    canvasLightboxImage.style.width = rect.width + "px";
    canvasLightboxImage.style.height = rect.height + "px";
    canvasLightboxImage.style.borderRadius = radius + "px";
  }

  function openCanvasLightbox(sourceImg) {
    ensureCanvasLightbox();
    if (!canvasLightbox || !canvasLightboxImage || lightboxAnimating) return;

    var startRect = sourceImg.getBoundingClientRect();
    var ratio = sourceImg.naturalWidth && sourceImg.naturalHeight ? sourceImg.naturalWidth / sourceImg.naturalHeight : 16 / 9;
    var targetRect = getLightboxTargetRect(ratio);
    lightboxSourceEl = sourceImg;
    lightboxAnimating = true;

    canvasLightboxImage.style.transition = "none";
    canvasLightboxImage.style.opacity = "1";
    canvasLightboxImage.src = sourceImg.currentSrc || sourceImg.src;
    applyLightboxImageRect(startRect, 8);

    canvasLightbox.classList.add("is-visible");
    void canvasLightbox.offsetWidth;

    window.requestAnimationFrame(function () {
      canvasLightbox.classList.add("is-active");
      canvasLightboxImage.style.transition = "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      applyLightboxImageRect(targetRect, 12);
      window.setTimeout(function () {
        lightboxAnimating = false;
      }, 520);
    });
  }

  function closeCanvasLightbox(force) {
    if (!canvasLightbox || !canvasLightboxImage || !canvasLightbox.classList.contains("is-visible")) return;
    if (force) {
      canvasLightbox.classList.remove("is-active", "is-visible");
      canvasLightboxImage.style.transition = "none";
      canvasLightboxImage.style.opacity = "1";
      lightboxSourceEl = null;
      lightboxAnimating = false;
      return;
    }
    if (lightboxAnimating) return;

    lightboxAnimating = true;
    var endRect = lightboxSourceEl && lightboxSourceEl.isConnected ? lightboxSourceEl.getBoundingClientRect() : null;
    canvasLightbox.classList.remove("is-active");
    canvasLightboxImage.style.transition = "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)";

    if (endRect) {
      applyLightboxImageRect(endRect, 8);
    } else {
      var current = canvasLightboxImage.getBoundingClientRect();
      applyLightboxImageRect(
        {
          left: current.left + current.width * 0.04,
          top: current.top + current.height * 0.04,
          width: current.width * 0.92,
          height: current.height * 0.92
        },
        12
      );
      canvasLightboxImage.style.opacity = "0";
    }

    window.setTimeout(function () {
      canvasLightbox.classList.remove("is-visible");
      canvasLightboxImage.style.transition = "none";
      canvasLightboxImage.style.opacity = "1";
      lightboxSourceEl = null;
      lightboxAnimating = false;
    }, 460);
  }

  function handleCanvasMouseDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    setCanvasFocus(event.clientX, event.clientY);
    startCanvasDrag("mouse", event.clientX, event.clientY);
  }

  function handleCanvasMouseMove(event) {
    if (!dragState.dragging || dragState.dragInputType !== "mouse") return;
    event.preventDefault();
    moveCanvasDrag(event.clientX, event.clientY);
  }

  function handleCanvasMouseUp() {
    if (!dragState.dragging || dragState.dragInputType !== "mouse") return;
    endCanvasDrag();
  }

  function handleCanvasTouchStart(event) {
    if (!event.touches || !event.touches.length) return;
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open")) return;
    // The column gallery uses the viewport's native momentum scrolling on
    // touch devices. Never call preventDefault or turn a one-finger swipe into
    // a zoom gesture here; doing so freezes vertical scrolling on iOS/WeChat.
    if (isMobileCanvasMode()) {
      dragState.touchZoomActive = false;
      dragState.pinchActive = false;
      return;
    }
    if (event.touches.length >= 2) {
      event.preventDefault();
      dragState.pinchActive = true;
      stopCanvasInertia();
      stopCanvasSettle();
      if (dragState.dragging && dragState.dragInputType === "touch") {
        endCanvasDrag();
      }
      var dx = event.touches[0].clientX - event.touches[1].clientX;
      var dy = event.touches[0].clientY - event.touches[1].clientY;
      dragState.pinchStartDist = Math.max(8, Math.hypot(dx, dy));
      dragState.pinchStartZoom = dragState.zoomBase;
      var midX = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
      var midY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
      setCanvasFocus(midX, midY);
      dragState.pointerZoomBoost = 0;
      dragState.dragZoomBoost = 0;
      updateCanvasScaleTarget();
      setCanvasTargetScale(dragState.targetScale);
      return;
    }
    if (dragState.pinchActive) return;
    event.preventDefault();
    var touch = event.touches[0];
    startCanvasDrag("touch", touch.clientX, touch.clientY);
  }

  function handleCanvasTouchMove(event) {
    if (!event.touches || !event.touches.length) return;
    // Let the browser update canvasViewport.scrollTop and provide native
    // momentum/bounce. The scroll listener handles the seamless loop.
    if (isMobileCanvasMode()) return;
    if (dragState.pinchActive && event.touches.length >= 2) {
      event.preventDefault();
      var dx = event.touches[0].clientX - event.touches[1].clientX;
      var dy = event.touches[0].clientY - event.touches[1].clientY;
      var dist = Math.max(8, Math.hypot(dx, dy));
      var scaleFactor = dist / dragState.pinchStartDist;
      var midX = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
      var midY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
      setCanvasZoomAtPoint(dragState.pinchStartZoom * scaleFactor, midX, midY);
      dragState.parallaxTargetX = 0;
      dragState.parallaxTargetY = 0;
      requestDepthRender();
      return;
    }
    if (!dragState.dragging || dragState.dragInputType !== "touch") return;
    event.preventDefault();
    var touch = event.touches[0];
    moveCanvasDrag(touch.clientX, touch.clientY);
  }

  function handleCanvasTouchEnd(event) {
    if (dragState.pinchActive && (!event.touches || event.touches.length < 2)) {
      dragState.pinchActive = false;
      dragState.pointerZoomBoost = 0;
      updateCanvasScaleTarget();
      setCanvasTargetScale(dragState.targetScale);
      if (event.touches && event.touches.length === 1) {
        var remain = event.touches[0];
        startCanvasDrag("touch", remain.clientX, remain.clientY);
      }
      return;
    }
    if (dragState.touchZoomActive && (!event.touches || !event.touches.length)) {
      dragState.touchZoomActive = false;
      dragState.pointerZoomBoost = 0;
      dragState.parallaxTargetX = 0;
      dragState.parallaxTargetY = 0;
      updateCanvasScaleTarget();
      setCanvasTargetScale(dragState.targetScale);
      requestDepthRender();
      return;
    }
    if (!dragState.dragging || dragState.dragInputType !== "touch") return;
    endCanvasDrag();
  }

  function handleCanvasPointerVisual(event) {
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open")) return;
    if (isMobileCanvasMode()) return;
    if (!canvasViewport || !canvasViewport.contains(event.target)) return;
    if (dragState.dragging) return;

    setCanvasFocus(event.clientX, event.clientY);
    requestDepthRender();
  }

  function handleCanvasWheel(event) {
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open") || isMobileCanvasMode()) return;
    if (!canvasWorld) return;

    var deltaY = event.deltaY;
    var deltaX = event.deltaX;
    if (Math.abs(deltaY) < 0.01 && Math.abs(deltaX) < 0.01) return;

    event.preventDefault();
    stopCanvasInertia();
    stopCanvasSettle();
    setCanvasFocus(event.clientX, event.clientY);

    if (event.ctrlKey || event.metaKey) {
      var zoomFactor = Math.exp(-deltaY * 0.00058);
      setCanvasZoomAtPoint(dragState.zoomBase * zoomFactor, event.clientX, event.clientY);
    } else {
      var panX = event.shiftKey ? deltaY : deltaX;
      var panY = event.shiftKey ? 0 : deltaY;
      if (dragState.loopEnabled) {
        dragState.x -= panX * 0.9;
        dragState.y -= panY * 0.9;
      } else {
        dragState.x = applyRubber(dragState.x - panX * 0.9, dragState.minX, dragState.maxX, 0.2);
        dragState.y = applyRubber(dragState.y - panY * 0.9, dragState.minY, dragState.maxY, 0.2);
        dragState.x = clamp(dragState.x, dragState.hardMinX, dragState.hardMaxX);
        dragState.y = clamp(dragState.y, dragState.hardMinY, dragState.hardMaxY);
      }
    }

    dragState.vx = 0;
    dragState.vy = 0;
    dragState.suppressClickUntil = Date.now() + 160;
    syncCanvasTransform();
    requestDepthRender();
  }

  function openInfiniteCanvas() {
    if (!canvasOverlay) return;
    // Treat the canvas as its own full-screen page layer while it is open.
    document.body.classList.add("canvas-fullscreen-mode");
    ensureCanvasMarquee();
    var pptPanel = document.querySelector(".panel-ppt");
    if (pptPanel) pptPanel.scrollTop = 0;
    if (canvasViewport) canvasViewport.scrollTop = 0;
    dragState.suppressClickUntil = 0;
    // Reseed order each entry to keep loop content natural.
    dragState.orderCycle += 1;
    dragState.orderSeed = Date.now() + dragState.orderCycle * 7919;
    canvasOverlay.classList.add("is-open");
    canvasOverlay.setAttribute("aria-hidden", "false");
    canvasOverlay.style.setProperty("--zoom-glow", "0");
    canvasOverlay.style.setProperty("--grid-alpha", "0.06");
    canvasOverlay.style.setProperty("--grid-shift-x", "0px");
    canvasOverlay.style.setProperty("--grid-shift-y", "0px");
    canvasOverlay.style.setProperty("--wheel-pulse", "0");
    canvasOverlay.style.setProperty("--wheel-shift-y", "0px");
    ensureCanvasSeeded(true).then(function () {
      updateCanvasBounds();
      if (!dragState.loopEnabled) {
        dragState.x = clamp(dragState.x, dragState.minX, dragState.maxX);
        dragState.y = clamp(dragState.y, dragState.minY, dragState.maxY);
      }
      var viewport = getViewportSize();
      setCanvasFocus(viewport.w * 0.5, viewport.h * 0.5);
      syncCanvasTransform();
      requestDepthRender();
    });
  }

  function closeInfiniteCanvas(immediate) {
    if (!canvasOverlay) {
      document.body.classList.remove("canvas-fullscreen-mode");
      return;
    }
    if (immediate) {
      closeCanvasLightbox(true);
      resetDragTracking();
      stopCanvasInertia();
      stopCanvasSettle();
      stopCanvasScaleAnimation();
      stopWheelShock();
      stopDepthRender();
      dragState.vx = 0;
      dragState.vy = 0;
      dragState.zoomBase = 1;
      dragState.dragZoomBoost = 0;
      dragState.pointerZoomBoost = 0;
      dragState.scale = 1;
      dragState.targetScale = 1;
      dragState.pressScale = 1;
      dragState.pressTarget = 1;
      dragState.velocitySamples = [];
      dragState.parallaxX = 0;
      dragState.parallaxY = 0;
      dragState.parallaxTargetX = 0;
      dragState.parallaxTargetY = 0;
      dragState.pinchActive = false;
      dragState.touchZoomActive = false;
      if (dragState.pointerDecayTimer) {
        window.clearTimeout(dragState.pointerDecayTimer);
        dragState.pointerDecayTimer = 0;
      }
      if (canvasOverlay) {
        canvasOverlay.style.setProperty("--wheel-pulse", "0");
        canvasOverlay.style.setProperty("--wheel-shift-y", "0px");
      }
      dragState.suppressClickUntil = 0;
      if (canvasWorld) canvasWorld.classList.remove("is-dragging");
      if (canvasViewport) canvasViewport.classList.remove("is-grabbing");
    }
    canvasOverlay.classList.remove("is-open");
    canvasOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("canvas-fullscreen-mode");
  }

  function returnFromCanvasToResume() {
    closeInfiniteCanvas(true);
    var activeProjectPanel = stage.querySelector(".project-panel.is-active");
    if (!activeProjectPanel) return;

    activeProjectPanel.classList.add("is-leaving");
    activeProjectPanel.classList.remove("is-active");
    activePanel = null;
    document.body.classList.remove("project-panel-open");

    window.setTimeout(function () {
      panels.forEach(function (panel) {
        panel.classList.remove("is-active", "is-leaving", "ai-opening");
      });
      stage.classList.remove("is-active");
      stage.setAttribute("aria-hidden", "true");
      leaveProjectSingleMode();
    }, 420);
  }

  function handleCanvasResize() {
    if (!canvasOverlay || !canvasOverlay.classList.contains("is-open")) return;
    if (canvasSourceCache.length) {
      renderCanvasWorld(canvasSourceCache);
    } else {
      ensureCanvasSeeded(true);
    }
    requestDepthRender();
  }

  if (canvasEnterBtn) {
    var canvasEnterLastAt = 0;
    function activateCanvasEnter(event) {
      var now = Date.now();
      if (now - canvasEnterLastAt < 450) {
        if (event) event.preventDefault();
        return;
      }
      canvasEnterLastAt = now;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      openInfiniteCanvas();
    }
    canvasEnterBtn.addEventListener("click", activateCanvasEnter);
    canvasEnterBtn.addEventListener("touchend", activateCanvasEnter, { passive: false });
    canvasEnterBtn.addEventListener("pointerup", function (event) {
      if (event.pointerType === "touch") activateCanvasEnter(event);
    });
  }

  if (canvasArrowBtn) {
    canvasArrowBtn.addEventListener("click", function () {
      openInfiniteCanvas();
    });
  }

  if (canvasCloseBtn) {
    canvasCloseBtn.addEventListener("click", function () {
      // This control belongs to the canvas page and returns directly to the
      // main resume, skipping the intermediate 02 project page.
      returnFromCanvasToResume();
    });
  }

  if (canvasViewport) {
    canvasViewport.addEventListener("mousedown", handleCanvasMouseDown);
    canvasViewport.addEventListener("wheel", handleCanvasWheel, { passive: false });
    canvasViewport.addEventListener("scroll", handleColumnLoopScroll, { passive: true });
    // Column mode must stay entirely native on touch devices. Attaching even
    // a non-passive document touchmove handler can disable asynchronous
    // scrolling in iOS and embedded WeChat browsers.
    if (!isMobileCanvasMode()) {
      canvasViewport.addEventListener("touchstart", handleCanvasTouchStart, { passive: false });
    }
  }

  document.addEventListener("mousemove", handleCanvasMouseMove);
  document.addEventListener("mousemove", handleCanvasPointerVisual);
  document.addEventListener("mouseup", handleCanvasMouseUp);
  if (!isMobileCanvasMode()) {
    document.addEventListener("touchmove", handleCanvasTouchMove, { passive: false });
    document.addEventListener("touchend", handleCanvasTouchEnd);
    document.addEventListener("touchcancel", handleCanvasTouchEnd);
  }
  window.addEventListener("blur", function () {
    if (dragState.dragging) endCanvasDrag();
  });

  if (canvasWorld) {
    canvasWorld.addEventListener(
      "click",
      function (event) {
        var img = event.target.closest(".canvas-thumb img");
        if (!img) return;
        if (Date.now() < dragState.suppressClickUntil || dragState.dragging) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        openCanvasLightbox(img);
      },
      true
    );

    canvasWorld.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  }

})();
