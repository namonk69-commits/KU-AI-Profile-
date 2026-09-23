/**
 * RAMEN PERSONA PROFILE & PORTFOLIO
 * Interactive JavaScript Engine
 * Author: Namon Karnsa-art (ณมน การสอาด)
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSoundEffects();
  initToppingInteractions();
  initKeyboardShortcuts();
  updatePortfolioCounts();
});

/* =========================================================
   1. NAVIGATION & SECTION SCROLL / HIGHLIGHT
   ========================================================= */
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSectionId = btn.getAttribute("data-section");
      switchSection(targetSectionId);
    });
  });

  // Intersection Observer for scroll highlight
  const sections = document.querySelectorAll(".page-section");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        updateActiveNav(id);
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

function switchSection(sectionId) {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    playCuteSound("pop");
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveNav(sectionId);
  }
}

function updateActiveNav(sectionId) {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    if (btn.getAttribute("data-section") === sectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

/* =========================================================
   2. PORTFOLIO FILTERING (2D / ANIMATION / ADOPT CMS)
   ========================================================= */
function filterPortfolio(category) {
  playCuteSound("click");

  // Update Tab Buttons
  const tabButtons = document.querySelectorAll(".port-tab-btn");
  tabButtons.forEach((btn) => {
    if (btn.getAttribute("data-tab") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Filter Cards
  const cards = document.querySelectorAll(".portfolio-card");
  cards.forEach((card) => {
    const cardCat = card.getAttribute("data-category");
    if (category === "all" || cardCat === category) {
      card.style.display = "flex";
      card.style.animation = "fadeInUp 0.4s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

function updatePortfolioCounts() {
  const count2d = document.querySelectorAll(
    '.portfolio-card[data-category="2d"]',
  ).length;
  const countAnim = document.querySelectorAll(
    '.portfolio-card[data-category="animation"]',
  ).length;
  const countAdopt = document.querySelectorAll(
    '.portfolio-card[data-category="adopt"]',
  ).length;

  const el2d = document.getElementById("count2d");
  const elAnim = document.getElementById("countAnim");
  const elAdopt = document.getElementById("countAdopt");

  if (el2d) el2d.textContent = count2d;
  if (elAnim) elAnim.textContent = countAnim;
  if (elAdopt) elAdopt.textContent = countAdopt;
}

/* =========================================================
   3. ARTWORK LIGHTBOX MODAL
   ========================================================= */
function openLightbox(mediaSrc, title, description) {
  playCuteSound("slurp");

  const modal = document.getElementById("artworkLightbox");
  const modalImg = document.getElementById("lightboxImage");
  const modalVideo = document.getElementById("lightboxVideo");
  const modalTitle = document.getElementById("lightboxTitle");
  const modalDesc = document.getElementById("lightboxDescription");

  if (modal && modalTitle && modalDesc) {
    modalTitle.textContent = title;
    modalDesc.textContent = description;

    // Check if the media is a video
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaSrc.trim());

    if (isVideo) {
      if (modalImg) {
        modalImg.style.display = "none";
        modalImg.src = "";
      }
      if (modalVideo) {
        modalVideo.style.display = "block";
        modalVideo.innerHTML = ""; // Clear previous sources

        if (/\.mov$/i.test(mediaSrc.trim())) {
          // If MOV, add MP4 version first as preferred web stream, with MOV fallback
          const mp4Src = mediaSrc.replace(/\.mov$/i, ".mp4");
          const srcMp4 = document.createElement("source");
          srcMp4.src = mp4Src;
          srcMp4.type = "video/mp4";
          const srcMov = document.createElement("source");
          srcMov.src = mediaSrc;
          srcMov.type = "video/quicktime";
          modalVideo.appendChild(srcMp4);
          modalVideo.appendChild(srcMov);
          modalVideo.removeAttribute("src");
        } else {
          modalVideo.src = mediaSrc;
        }

        modalVideo.load();
        modalVideo.currentTime = 0;
        const playPromise = modalVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with audio was blocked or interrupted, user can click play controls
          });
        }
      }
    } else {
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute("src");
        modalVideo.innerHTML = "";
        modalVideo.style.display = "none";
      }
      if (modalImg) {
        modalImg.style.display = "block";
        modalImg.src = mediaSrc;
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeLightbox() {
  playCuteSound("pop");
  const modal = document.getElementById("artworkLightbox");
  const modalVideo = document.getElementById("lightboxVideo");

  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.innerHTML = "";
    modalVideo.style.display = "none";
  }

  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

/* =========================================================
   4. ADD NEW ITEM MODAL (DYNAMIC WORKSPACE)
   ========================================================= */
function openAddNewItemModal() {
  playCuteSound("pop");
  const modal = document.getElementById("addItemModal");
  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeAddNewItemModal() {
  const modal = document.getElementById("addItemModal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function handleAddNewArtwork(event) {
  event.preventDefault();

  const category = document.getElementById("newWorkCategory").value;
  const title = document.getElementById("newWorkTitle").value.trim();
  const desc = document.getElementById("newWorkDesc").value.trim();
  const imgSrc =
    document.getElementById("newWorkImg").value.trim() || "assets/art-2d-1.svg";

  if (!title || !desc) {
    showToast("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(imgSrc);

  // Create new portfolio card
  const grid = document.getElementById("portfolioGrid");
  const newCard = document.createElement("div");
  newCard.className = "portfolio-card pencil-card";
  newCard.setAttribute("data-category", category);

  let typeBadgeClass = "type-2d";
  let typeLabel = "2D Art";
  if (category === "animation") {
    typeBadgeClass = "type-anim";
    typeLabel = "Animation";
  } else if (category === "adopt") {
    typeBadgeClass = "type-adopt";
    typeLabel = "Adoptable";
  }

  const mediaElementHtml = isVideo
    ? /\.mov$/i.test(imgSrc)
      ? `<video class="card-img" muted loop autoplay playsinline preload="metadata"><source src="${imgSrc.replace(/\.mov$/i, ".mp4")}" type="video/mp4"><source src="${imgSrc}" type="video/quicktime"></video>`
      : `<video src="${imgSrc}" class="card-img" muted loop autoplay playsinline preload="metadata"></video>`
    : `<img src="${imgSrc}" alt="${title}" class="card-img">`;

  newCard.innerHTML = `
    <div class="card-media-slot" onclick="openLightbox('${imgSrc}', '${title}', '${desc}')">
      ${mediaElementHtml}
      <div class="media-hover-overlay">
        <i class="fa-solid fa-play"></i>
        <span>${isVideo ? "คลิกเพื่อดูและเล่นวิดีโอเต็ม" : "คลิกเพื่อดูภาพขยาย"}</span>
      </div>
      <span class="card-type-badge ${typeBadgeClass}">${typeLabel}</span>
    </div>
    <div class="card-content">
      <h3 class="card-title">${title}</h3>
      <p class="card-desc">${desc}</p>
      <div class="card-footer-meta">
        <span class="meta-tag"><i class="fa-solid fa-calendar-day"></i> ใหม่!</span>
        <span class="meta-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> Custom Work</span>
      </div>
    </div>
  `;

  // Prepend to grid
  grid.prepend(newCard);

  // Close modal and switch to corresponding tab
  closeAddNewItemModal();
  filterPortfolio(category);
  updatePortfolioCounts();
  showToast("🍜 เพิ่มผลงานใหม่สำเร็จแล้ว!");
  playCuteSound("pop");

  // Reset form
  document.getElementById("addNewItemForm").reset();
}

/* =========================================================
   5. EMAIL COPY & TOAST NOTIFICATION
   ========================================================= */
function copyEmailToClipboard() {
  const emailText = document
    .getElementById("contactEmailText")
    .innerText.trim();

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(emailText)
      .then(() => {
        showToast("📋 คัดลอกอีเมลเรียบร้อยแล้ว: " + emailText);
        playCuteSound("pop");
      })
      .catch(() => {
        fallbackCopyText(emailText);
      });
  } else {
    fallbackCopyText(emailText);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showToast("📋 คัดลอกอีเมลเรียบร้อยแล้ว: " + text);
    playCuteSound("pop");
  } catch (err) {
    showToast("อีเมล: " + text);
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById("toastMsg");
  const toastText = document.getElementById("toastText");
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

/* =========================================================
   6. TOPPING & CHOPSTICK INTERACTIONS & SPARKLES
   ========================================================= */
function initToppingInteractions() {
  const toppings = document.querySelectorAll(".floating-topping");

  toppings.forEach((topping) => {
    topping.addEventListener("click", (e) => {
      createSparkleEffect(e.clientX, e.clientY);
      playCuteSound("pop");
    });
  });

  const chopsticks = document.getElementById("heroChopsticks");
  if (chopsticks) {
    chopsticks.addEventListener("click", (e) => {
      playCuteSound("slurp");
      createSparkleEffect(e.clientX, e.clientY);
      showToast("🍜 ซู๊ดดด! ราเมงแสนอร่อย");
    });
  }
}

function spawnToppingSparkle(toppingType) {
  playCuteSound("pop");
  const toppingNames = {
    chashu: "🥩 หมูชาชูนุ่มละมุน!",
    naruto: "🍥 ลูกชิ้นนารุโตะมากิ!",
    egg: "🥚 ไข่ยางมะตูมเยิ้มๆ!",
    scallion: "🌱 ต้นหอมซอยหอมสดชื่น!",
    nori: "🍙 สาหร่ายแผ่นกรุบกรอบ!",
  };
  showToast(toppingNames[toppingType] || "🍜 อร่อย!");
}

function createSparkleEffect(x, y) {
  const sparkles = ["✨", "⭐", "🍜", "🍥", "🥢", "💖"];
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle-particle";
    particle.textContent =
      sparkles[Math.floor(Math.random() * sparkles.length)];
    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${Math.random() * 16 + 14}px`;
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9999";
    particle.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
    document.body.appendChild(particle);

    const destX = (Math.random() - 0.5) * 120;
    const destY = (Math.random() - 0.8) * 120;

    requestAnimationFrame(() => {
      particle.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
      particle.style.opacity = "0";
    });

    setTimeout(() => {
      particle.remove();
    }, 800);
  }
}

/* =========================================================
   7. SOUND EFFECTS (Web Audio API Synthesizer)
   ========================================================= */
let isSoundEnabled = true;
let audioCtx = null;

function initSoundEffects() {
  const soundToggle = document.getElementById("soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      isSoundEnabled = !isSoundEnabled;
      soundToggle.innerHTML = isSoundEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
      showToast(
        isSoundEnabled ? "🔊 เปิดเสียงประกอบแล้ว" : "🔇 ปิดเสียงประกอบแล้ว",
      );
    });
  }
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCuteSound(type) {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "pop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "slurp") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Gentle click
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (err) {
    // Graceful fallback if audio is blocked
  }
}

/* =========================================================
   8. KEYBOARD SHORTCUTS
   ========================================================= */
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeAddNewItemModal();
    }
  });
}
