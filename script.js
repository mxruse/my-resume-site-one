(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector(".top-nav");
  var toggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelectorAll(".top-nav a");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
    });
  }
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "打开导航");
        }
      }
    });
  });

  var i18nMap = {
    zh: {
      "nav.exchange": "首页",
      "nav.about": "个人介绍",
      "nav.market": "项目经历",
      "nav.wallet": "联系方式",
      "nav.company": "邮箱",
      "nav.support": "联系我",
      "hero.title1": "毛晓锐",
      "hero.title2": "无限进步",
      "hero.desc": "淮南师范学院大一新生，是一个对AI应用的狂热者，无限探索的拓路者。正在寻找AI与代码对生活应用的协作极限。",
      "hero.artistLabel": "创作者 / 参赛者",
      "hero.artistName": "毛晓锐 · MXR",
      "hero.bidLabel": "教育经历",
      "hero.metric": "物理学（师范）本科",
      "hero.more": "查看 +",
      "edu.tag": "教育背景",
      "edu.code": "// ACADEMIC_PARAMETERS",
      "edu.title": "求学之路。",
      "edu.schoolLabel": "院校",
      "edu.schoolValue": "淮南师范学院",
      "edu.majorLabel": "专业",
      "edu.majorValue": "物理学",
      "edu.stageLabel": "阶段",
      "edu.stageValue": "大一",
      "edu.gpaLabel": "加权绩点 (GPA)",
      "edu.gpaValue": "不止步于课堂 / 5.0",
      "profile.kicker": "个人介绍",
      "profile.title": "毛晓锐 · 个人介绍",
      "profile.desc": "淮南师范学院大一新生，对AI应用与视觉表达充满热情，持续探索AI与代码在生活场景中的协作极限。",
      "profile.tag1": "学生",
      "profile.tag2": "AI探索者",
      "profile.tag3": "前端搭建者",
      "profile.school": "淮南师范学院 · 物理学（师范）本科",
      "profile.contact": "电话 13685693697 · 微信 MXR--0821",
      "profile.email": "邮箱 3080535481@qq.com",
      "light.quote": "我专注于把 AI 应用、代码实现与视觉表达结合，持续打磨有设计感且可落地的数字作品。",
      "light.c1title": "项目经历",
      "light.c1desc1": "AI+编程开发者",
      "light.c1desc2": "将创意需求转化为可运行网页与交互",
      "light.c2title": "项目经历",
      "light.c2desc1": "PPT设计者：聚焦信息结构与视觉叙事",
      "light.c3title": "项目经历",
      "light.c3desc1": "自媒体创作者：持续输出内容与观点",
      "light.natureTitle": "联系方式",
      "light.morning": "电话",
      "light.night": "邮箱",
      "light.n1": "电话：13685693697",
      "light.n2": "微信：MXR--0821",
      "light.n3": "邮箱：3080535481@qq.com",
      "light.visualTitle": "核心能力",
      "light.v1": "大模型训练与调优",
      "light.v1d": "样本清洗、逻辑校准与准确率评测优化",
      "light.v2": "智能体应用开发",
      "light.v2d": "基于百炼平台进行角色、工具与知识库配置",
      "light.v3": "结构化提示词工程",
      "light.v3d": "复杂任务拆解与分步提示设计，稳定提升输出质量",
      "light.v4": "AI辅助编程自动化",
      "light.v4d": "实现学情数据清洗、统计与报告自动化生成",
      "light.v5": "数学建模与几何分析",
      "light.v5d": "具备抽象建模能力，擅长优化解题路径",
      "video.title": "精选项目概览",
      "video.desc": "项目一：对话式大模型问答准确率优化；项目二：基于百炼平台的智能学业助手搭建；项目三：学情数据自动化整理与报告生成。该站点用于集中展示我的核心实践成果。",
      "resume.name": "毛晓锐 · 无限进步",
      "resume.intro": "淮南师范学院大一新生，对AI应用充满热情，持续探索AI与代码在视觉艺术中的协作极限。",
      "resume.edu": "教育经历：淮南师范学院 本科 物理学（师范）",
      "resume.role1": "AI+编程开发者",
      "resume.role2": "PPT设计者",
      "resume.role3": "自媒体创作者"
    },
    en: {
      "nav.exchange": "HOME",
      "nav.about": "PROFILE",
      "nav.market": "PROJECTS",
      "nav.wallet": "CONTACT",
      "nav.company": "EMAIL",
      "nav.support": "CONTACT ME",
      "hero.title1": "MAO XIAORUI",
      "hero.title2": "UNLIMITED PROGRESS",
      "hero.desc": "First-year student at Huainan Normal University, passionate about AI applications and creative problem solving, exploring practical collaboration between AI and code.",
      "hero.artistLabel": "Artist",
      "hero.artistName": "Mao Xiaorui · MXR",
      "hero.bidLabel": "Education",
      "hero.metric": "B.Sc. Physics (Normal)",
      "hero.more": "VIEW +",
      "edu.tag": "EDUCATION",
      "edu.code": "// ACADEMIC_PARAMETERS",
      "edu.title": "Academic Journey.",
      "edu.schoolLabel": "University",
      "edu.schoolValue": "Huainan Normal University",
      "edu.majorLabel": "Major",
      "edu.majorValue": "Physics",
      "edu.stageLabel": "Stage",
      "edu.stageValue": "Freshman",
      "edu.gpaLabel": "Weighted GPA",
      "edu.gpaValue": "Beyond Classroom / 5.0",
      "profile.kicker": "PERSONAL PROFILE",
      "profile.title": "Mao Xiaorui · Personal Profile",
      "profile.desc": "First-year student at Huainan Normal University, passionate about AI applications and visual expression, continuously exploring practical collaboration between AI and code.",
      "profile.tag1": "Student",
      "profile.tag2": "AI Explorer",
      "profile.tag3": "Frontend Builder",
      "profile.school": "Huainan Normal University · B.Sc. Physics (Normal)",
      "profile.contact": "Phone 13685693697 · WeChat MXR--0821",
      "profile.email": "Email 3080535481@qq.com",
      "light.quote": "I focus on combining AI applications, coding implementation, and visual expression to craft practical digital works with strong design quality.",
      "light.c1title": "Project Role",
      "light.c1desc1": "AI + Coding Developer",
      "light.c1desc2": "Transforming ideas into runnable pages and interaction flows",
      "light.c2title": "Project Role",
      "light.c2desc1": "PPT Designer: focused on visual narrative and information structure",
      "light.c3title": "Project Role",
      "light.c3desc1": "Self-media Creator: producing consistent content and viewpoints",
      "light.natureTitle": "Contact",
      "light.morning": "Phone",
      "light.night": "Email",
      "light.n1": "Phone: 13685693697",
      "light.n2": "WeChat: MXR--0821",
      "light.n3": "Email: 3080535481@qq.com",
      "light.visualTitle": "Core Skills",
      "light.v1": "LLM Training and Optimization",
      "light.v1d": "Data cleaning, logic calibration, and accuracy evaluation",
      "light.v2": "Agent Application Development",
      "light.v2d": "Role, tool, and knowledge-base setup on Bailian platform",
      "light.v3": "Structured Prompt Engineering",
      "light.v3d": "Task decomposition and step-by-step prompt design",
      "light.v4": "AI-assisted Coding Automation",
      "light.v4d": "Automating learning-data processing and reporting workflows",
      "light.v5": "Math Modeling and Geometry Analysis",
      "light.v5d": "Strong abstraction and optimized solution-path design",
      "video.title": "Featured Projects Overview",
      "video.desc": "Project 1: conversational LLM QA optimization. Project 2: intelligent learning assistant on Bailian. Project 3: automated learning data reporting.",
      "resume.name": "Mao Xiaorui · Unlimited Progress",
      "resume.intro": "First-year student at Huainan Normal University, passionate about AI applications and exploring the collaboration limit between AI, code, and visual art.",
      "resume.edu": "Education: Huainan Normal University · B.Sc. in Physics (Normal)",
      "resume.role1": "AI + Coding Developer",
      "resume.role2": "PPT Designer",
      "resume.role3": "Self-media Creator"
    }
  };

  var langToggle = document.getElementById("langToggle");
  var langLabel = document.getElementById("langLabel");
  var langFlag = document.getElementById("langFlag");
  var translatable = document.querySelectorAll("[data-i18n]");

  function applyLanguage(lang) {
    var dict = i18nMap[lang] || i18nMap.zh;
    translatable.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (dict[key]) node.textContent = dict[key];
    });
    if (langLabel) langLabel.textContent = lang === "zh" ? "中文" : "EN";
    if (langFlag) langFlag.textContent = lang === "zh" ? "🇨🇳" : "🇺🇸";
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    try {
      localStorage.setItem("portfolio_lang", lang);
    } catch (error) {
      // Private browsing and locked-down iframe contexts may disable storage.
    }
  }

  var storedLang = null;
  try {
    storedLang = localStorage.getItem("portfolio_lang");
  } catch (error) {
    // Fall back to the browser language when storage is unavailable.
  }
  var browserLang = navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  var currentLang = storedLang === "zh" || storedLang === "en" ? storedLang : browserLang;
  // The current resume is a Chinese-only document without a language switcher.
  // Keep its declared language and CJK font stack stable unless translations
  // or an explicit language control are present in the markup.
  if (translatable.length || langToggle) applyLanguage(currentLang);
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      currentLang = currentLang === "zh" ? "en" : "zh";
      applyLanguage(currentLang);
    });
  }

  var glow = document.getElementById("cursorGlow");
  if (glow) {
    var glowRaf = 0;
    var glowX = 0;
    var glowY = 0;
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    function renderGlow() {
      glowRaf = 0;
      glow.style.left = glowX + "px";
      glow.style.top = glowY + "px";
      glow.style.opacity = "1";
    }

    if (finePointer) {
      document.addEventListener("mousemove", function (event) {
        glowX = event.clientX;
        glowY = event.clientY;
        if (!glowRaf) glowRaf = window.requestAnimationFrame(renderGlow);
      });
    }

    document.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  // The hero is the first thing users should see. Reveal it immediately so
  // a delayed/disabled IntersectionObserver can never leave the opening
  // viewport blank (the CSS layer also provides a no-JS fallback).
  document.querySelectorAll(".hero .reveal").forEach(function (node) {
    node.classList.add("is-visible");
  });
  if ("IntersectionObserver" in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (node, index) {
      node.style.transitionDelay = (index % 5) * 0.1 + "s";
      observer.observe(node);
    });
  } else {
    reveals.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }
})();

/* Hero NFT 3D carousel
 * - 桌面端展示 5 卡弧形布局
 * - 支持点击切换、按钮切换、触摸滑动
 * - 只作用于首版 Hero，不影响其他模块
 */
(function () {
  var stage = document.querySelector(".nft-stage");
  var carousel = document.getElementById("nftCarousel");
  if (!stage || !carousel) return;

  var cards = Array.prototype.slice.call(carousel.querySelectorAll(".nft-card"));
  if (cards.length < 3) return;

  var prevBtn = document.getElementById("nftPrevBtn");
  var nextBtn = document.getElementById("nftNextBtn");
  var activeIndex = Math.floor(cards.length / 2);
  var touchStartX = 0;
  var touchStartY = 0;

  function wrapIndex(index) {
    var len = cards.length;
    return ((index % len) + len) % len;
  }

  function getCircularOffset(index, active) {
    var len = cards.length;
    var raw = index - active;
    if (raw > len / 2) raw -= len;
    if (raw < -len / 2) raw += len;
    return raw;
  }

  function updateCards() {
    var mobileMode = window.matchMedia("(max-width: 767px)").matches;

    cards.forEach(function (card, index) {
      var offset = getCircularOffset(index, activeIndex);
      var absOffset = Math.abs(offset);
      var sign = offset === 0 ? 0 : offset > 0 ? 1 : -1;

      // 超出两侧的卡片保持在场景内但弱化，保证切换连续性。
      var capped = Math.min(absOffset, 2);
      // 调大首版卡片后同步放大横向间距与纵深，保持弧形层次和不重叠。
      var xStep = mobileMode ? 144 : 282;
      var x = sign * (capped === 2 ? xStep * 1.88 : xStep * capped);
      var z = mobileMode ? -Math.min(absOffset, 1) * 96 : -capped * 168;
      var y = mobileMode ? capped * 10 : capped * 14;
      var scale = mobileMode ? (capped === 0 ? 1 : 0.9) : capped === 0 ? 1 : capped === 1 ? 0.9 : 0.76;
      var rotateY = mobileMode ? sign * (capped === 0 ? 0 : 11) : sign * (capped === 0 ? 0 : capped === 1 ? 17 : 30);
      var opacity = mobileMode ? (absOffset <= 1 ? 1 : 0) : capped === 0 ? 1 : capped === 1 ? 0.72 : 0.42;
      var blur = mobileMode ? (absOffset <= 1 ? 0 : 8) : capped === 0 ? 0 : capped === 1 ? 0.8 : 2.2;

      card.style.transform =
        "translate3d(calc(-50% + " +
        x.toFixed(1) +
        "px), " +
        y.toFixed(1) +
        "px, " +
        z.toFixed(1) +
        "px) rotateY(" +
        rotateY.toFixed(1) +
        "deg) scale(" +
        scale.toFixed(3) +
        ")";
      card.style.opacity = String(opacity);
      card.style.filter = "blur(" + blur.toFixed(2) + "px)";
      card.style.zIndex = String(100 - Math.min(absOffset, 3) * 10);
      card.classList.toggle("is-active", absOffset === 0);
      card.setAttribute("aria-hidden", absOffset > 2 ? "true" : "false");
    });
  }

  function goTo(index) {
    activeIndex = wrapIndex(index);
    updateCards();
  }

  function goStep(step) {
    goTo(activeIndex + step);
  }

  cards.forEach(function (card, index) {
    card.addEventListener("click", function () {
      if (index === activeIndex) return;
      goTo(index);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function (event) {
      event.preventDefault();
      goStep(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (event) {
      event.preventDefault();
      goStep(1);
    });
  }

  stage.addEventListener(
    "touchstart",
    function (event) {
      if (!event.touches || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchend",
    function (event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      var endX = event.changedTouches[0].clientX;
      var endY = event.changedTouches[0].clientY;
      var deltaX = endX - touchStartX;
      var deltaY = endY - touchStartY;
      if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goStep(deltaX > 0 ? -1 : 1);
      }
    },
    { passive: true }
  );

  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      goStep(-1);
    } else if (event.key === "ArrowRight") {
      goStep(1);
    }
  });

  window.addEventListener("resize", updateCards);
  updateCards();
})();

/* Single dark theme ------------------------------------------------------- */
(function () {
  var root = document.documentElement;
  root.classList.add("dark");
  root.setAttribute("data-theme", "dark");
  root.style.colorScheme = "dark";
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", "#0a0a0f");
})();

/* Shared liquid-metal button interaction ----------------------------------
 * Keeps the effect dependency-free so it works with this static resume site.
 */
(function () {
  function enhanceButtons() {
    var controls = document.querySelectorAll(
      'button:not(.menu-toggle), .support-btn, .hero-cta, .card-bottom-info a, .nav-core a'
    );
    controls.forEach(function (el) {
      if (el.dataset.liquidEnhanced === "true") return;
      el.classList.add("liquid-btn");
      el.dataset.liquidEnhanced = "true";

      el.addEventListener("pointerenter", function () {
        el.classList.add("is-hovered");
      });
      el.addEventListener("pointerleave", function () {
        el.classList.remove("is-hovered", "is-pressed");
      });
      el.addEventListener("pointerdown", function (event) {
        el.classList.add("is-pressed");
        var rect = el.getBoundingClientRect();
        var ripple = document.createElement("span");
        ripple.className = "liquid-ripple";
        ripple.style.left = (event.clientX - rect.left) + "px";
        ripple.style.top = (event.clientY - rect.top) + "px";
        el.appendChild(ripple);
        window.setTimeout(function () {
          ripple.remove();
        }, 700);
      });
      el.addEventListener("pointerup", function () {
        el.classList.remove("is-pressed");
      });
      el.addEventListener("pointercancel", function () {
        el.classList.remove("is-pressed");
      });
    });
  }

  var observer = new MutationObserver(function () {
    enhanceButtons();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceButtons);
  } else {
    enhanceButtons();
  }
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
