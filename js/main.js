// ========== ОПРЕДЕЛЕНИЕ МОБИЛЬНОГО УСТРОЙСТВА ==========
function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth <= 768
  );
}

// ========== АНИМАЦИЯ ГЕРОЯ (туманность, звёзды, метеоры) ==========
class HeroNebula {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.stars = [];
    this.planets = [];
    this.meteors = [];
    this.isMobile = isMobile();
    this.resize();
    this.initStars(this.isMobile ? 400 : 1200);
    this.initPlanets(this.isMobile ? 2 : 5);
    if (!this.isMobile) this.initMeteors(8);
    window.addEventListener("resize", () => this.resize());
    this.animate();
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (!this.isMobile) this.initMeteors(8);
  }
  initStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++)
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 0.5 + Math.random() * (this.isMobile ? 1.5 : 2),
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.002 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
      });
  }
  initPlanets(count) {
    const colors = [
      "hsla(50,70%,40%,0.35)",
      "hsla(200,70%,45%,0.4)",
      "hsla(10,80%,45%,0.35)",
      "hsla(120,60%,35%,0.35)",
      "hsla(280,70%,45%,0.4)",
      "hsla(30,80%,50%,0.35)",
      "hsla(180,60%,40%,0.35)",
      "hsla(320,70%,50%,0.4)",
    ];
    this.planets = [];
    for (let i = 0; i < count; i++)
      this.planets.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius:
          (this.isMobile ? 3 : 5) + Math.random() * (this.isMobile ? 10 : 18),
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.07,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
  }
  initMeteors(count) {
    this.meteors = [];
    for (let i = 0; i < count; i++)
      this.meteors.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.5,
        vx: 2 + Math.random() * 5,
        vy: 3 + Math.random() * 6,
        length: 8 + Math.random() * 15,
        alpha: 0.5 + Math.random() * 0.5,
        active: true,
      });
  }
  drawBackground() {
    let grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, "#030312");
    grad.addColorStop(1, "#0a0a1a");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    const nebulaCount = this.isMobile ? 3 : 8;
    for (let i = 0; i < nebulaCount; i++) {
      let x = this.width * (0.2 + Math.sin(this.time * 0.0001 + i) * 0.2),
        y = this.height * (0.4 + Math.cos(this.time * 0.00008 + i) * 0.3),
        rad = this.width * 0.3;
      let grad2 = this.ctx.createRadialGradient(x, y, 0, x, y, rad);
      grad2.addColorStop(0, `rgba(50, 30, 100, 0.06)`);
      grad2.addColorStop(1, `rgba(10, 5, 30, 0)`);
      this.ctx.fillStyle = grad2;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
  drawStars() {
    for (let s of this.stars) {
      let twinkle = 0.6 + 0.4 * Math.sin(this.time * s.speed + s.phase);
      let alpha = s.alpha * twinkle;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 200, ${alpha * 0.8})`;
      this.ctx.fill();
    }
  }
  drawPlanets() {
    for (let p of this.planets) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -p.radius) p.x = this.width + p.radius;
      if (p.x > this.width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = this.height + p.radius;
      if (p.y > this.height + p.radius) p.y = -p.radius;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = "rgba(100, 80, 200, 0.4)";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }
  drawMeteors() {
    if (!this.meteors) return;
    for (let m of this.meteors) {
      let tailX = m.x - m.vx * m.length,
        tailY = m.y - m.vy * m.length;
      let grad = this.ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 200, ${m.alpha})`);
      grad.addColorStop(1, `rgba(255, 200, 150, 0)`);
      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = grad;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 240, 180, ${m.alpha})`;
      this.ctx.fill();
      m.x += m.vx;
      m.y += m.vy;
      if (
        m.x > this.width + 50 ||
        m.y > this.height + 50 ||
        m.x < -50 ||
        m.y < -50
      ) {
        m.x = Math.random() * this.width;
        m.y = -20;
        m.vx = 2 + Math.random() * 5;
        m.vy = 3 + Math.random() * 6;
        m.alpha = 0.5 + Math.random() * 0.5;
      }
    }
  }
  animate() {
    this.time = performance.now();
    this.drawBackground();
    this.drawStars();
    this.drawPlanets();
    if (!this.isMobile) this.drawMeteors();
    requestAnimationFrame(() => this.animate());
  }
}

// ========== ФОНОВЫЕ ЗВЁЗДЫ (мерцание) ==========
class StarBackground {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.isMobile = isMobile();
    this.config = {
      starCount: this.isMobile ? 200 : config.starCount || 550,
      starMaxRadius: this.isMobile ? 1.5 : 2.5,
    };
    this.stars = [];
    this.init();
  }
  init() {
    this.resizeCanvas();
    this.createStars();
    this.animateStars();
    window.addEventListener("resize", () => this.resizeCanvas());
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createStars();
  }
  createStars() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++)
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * this.config.starMaxRadius + 0.5,
        alpha: Math.random(),
        delta: Math.random() * 0.02 + 0.005,
      });
  }
  animateStars() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let star of this.stars) {
      star.alpha += star.delta;
      if (star.alpha <= 0.1 || star.alpha >= 1) star.delta *= -1;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 200, ${star.alpha})`;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animateStars());
  }
}

// ========== ПЛАНЕТЫ (вращение) ==========
function getJupiterSVG() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3CradialGradient id='jup' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%23e8c9a0'/%3E%3Cstop offset='100%25' stop-color='%23b57c48'/%3E%3C/radialGradient%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23jup)'/%3E%3Cpath d='M20,40 L80,42 M15,55 L85,53 M25,70 L75,68' stroke='%23945e2b' stroke-width='3' fill='none' opacity='0.5'/%3E%3C/svg%3E";
}
function getSaturnSVG() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3CradialGradient id='sat' cx='35%25' cy='35%25'%3E%3Cstop offset='0%25' stop-color='%23f2d6a0'/%3E%3Cstop offset='100%25' stop-color='%23c28a42'/%3E%3C/radialGradient%3E%3Ccircle cx='50' cy='50' r='40' fill='url(%23sat)'/%3E%3Cellipse cx='50' cy='50' rx='55' ry='12' fill='none' stroke='%23dbb46c' stroke-width='5' transform='rotate(-20 50 50)'/%3E%3C/svg%3E";
}
function getEarthSVG() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3CradialGradient id='earth' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%2366bbff'/%3E%3Cstop offset='100%25' stop-color='%231a6b9e'/%3E%3C/radialGradient%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23earth)'/%3E%3Cpath d='M35,30 Q45,25 55,32 Q65,38 70,50 Q65,65 50,70 Q35,68 28,55 Q30,38 35,30Z' fill='%234caf50' opacity='0.8'/%3E%3C/svg%3E";
}
class Planet {
  constructor(container, imageUrl, orbitRadius, speed) {
    this.element = document.createElement("div");
    this.element.className = "planet";
    this.element.style.setProperty("--orbit-radius", `${orbitRadius}px`);
    this.element.style.animationDuration = `${speed}s`;
    const img = document.createElement("img");
    img.src = imageUrl;
    this.element.appendChild(img);
    container.appendChild(this.element);
  }
}

// ========== АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ (отключаем на мобильных) ==========
class ScrollAnimator {
  constructor() {
    const elements = document.querySelectorAll(".content-section");
    elements.forEach((el) =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((e) =>
            e.isIntersecting
              ? e.target.classList.add("visible")
              : e.target.classList.remove("visible"),
          );
        },
        { threshold: 0.2 },
      ).observe(el),
    );
  }
}

// ========== ЗВЁЗДНАЯ КАРТА ПО ДАТЕ (без анимации на мобильных) ==========
class StarDateMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.stars = [];
    this.animationId = null;
    this.isMobile = isMobile();
    this.resizeDebounce = null;
    window.addEventListener("resize", () => this.handleResize());
    this.resizeCanvasAndRedraw();
  }
  handleResize() {
    if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(() => this.resizeCanvasAndRedraw(), 150);
  }
  resizeCanvasAndRedraw() {
    if (!this.canvas.parentElement) return;
    const w = this.canvas.parentElement.clientWidth;
    if (w <= 0) return;
    this.canvas.width = w;
    this.canvas.height = w * 0.4545;
    if (this.stars.length) this.drawStars();
  }
  generateByDate(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++)
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    const rnd = (min, max, off) => {
      let x = Math.sin(hash + off) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };
    let starArr = [];
    const starCount = this.isMobile ? 350 : 720;
    for (let i = 0; i < starCount; i++)
      starArr.push({
        x: rnd(0.03, 0.97, i * 11),
        y: rnd(0.03, 0.97, i * 23 + 50),
        rad: rnd(0.7, this.isMobile ? 2.2 : 3.2, i * 37),
        bright: rnd(0.5, 1, i * 59),
        col: (() => {
          let t = Math.floor(rnd(0, 4, i * 73));
          return t === 0
            ? { r: 255, g: 220, b: 150 }
            : t === 1
              ? { r: 180, g: 210, b: 255 }
              : { r: 245, g: 245, b: 245 };
        })(),
      });
    this.stars = starArr;
    this.drawStars();
    if (!this.isMobile) this.startAnimation();
    document.getElementById("sky-info").innerHTML =
      `<p>✨ Ночное небо на ${dateStr}: уникальный узор из ${starCount} звёзд${this.isMobile ? " (статичный)" : " с мерцанием"}.</p>`;
  }
  drawStars() {
    if (!this.ctx || !this.canvas.width) return;
    const w = this.canvas.width,
      h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
    let grad = this.ctx.createLinearGradient(0, 0, w * 0.2, h);
    grad.addColorStop(0, "#010110");
    grad.addColorStop(1, "#0a1122");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);
    for (let s of this.stars) {
      let x = s.x * w,
        y = s.y * h;
      this.ctx.beginPath();
      this.ctx.arc(x, y, s.rad, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${s.col.r},${s.col.g},${s.col.b},${s.bright})`;
      this.ctx.fill();
      if (s.rad > 1.6) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, s.rad * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255,240,180,${s.bright * 0.6})`;
        this.ctx.fill();
      }
    }
  }
  startAnimation() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const animate = () => {
      this.drawStars();
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }
  updateDate(date) {
    this.generateByDate(date);
  }
}

// ========== ЗНАКИ ЗОДИАКА (ДАННЫЕ) ==========
const zodiacSigns = [
  {
    name: "Овен",
    symbol: "♈",
    start: "03-21",
    end: "04-19",
    dates: "21 марта – 19 апреля",
    description:
      "Овен — лидер, первооткрыватель, наделённый огненной энергией и смелостью.",
  },
  {
    name: "Телец",
    symbol: "♉",
    start: "04-20",
    end: "05-20",
    dates: "20 апреля – 20 мая",
    description:
      "Телец ценит стабильность, гармонию и земные радости, обладает терпением.",
  },
  {
    name: "Близнецы",
    symbol: "♊",
    start: "05-21",
    end: "06-20",
    dates: "21 мая – 20 июня",
    description:
      "Близнецы — мастера коммуникации, любознательны и многогранны.",
  },
  {
    name: "Рак",
    symbol: "♋",
    start: "06-21",
    end: "07-22",
    dates: "21 июня – 22 июля",
    description:
      "Рак — хранитель домашнего очага, глубоко эмоционален и заботлив.",
  },
  {
    name: "Лев",
    symbol: "♌",
    start: "07-23",
    end: "08-22",
    dates: "23 июля – 22 августа",
    description: "Лев — король зодиака, щедрый, страстный и творческий.",
  },
  {
    name: "Дева",
    symbol: "♍",
    start: "08-23",
    end: "09-22",
    dates: "23 августа – 22 сентября",
    description: "Дева аналитична, стремится к порядку и совершенству.",
  },
  {
    name: "Весы",
    symbol: "♎",
    start: "09-23",
    end: "10-22",
    dates: "23 сентября – 22 октября",
    description: "Весы ищут баланс, красоту и справедливость.",
  },
  {
    name: "Скорпион",
    symbol: "♏",
    start: "10-23",
    end: "11-21",
    dates: "23 октября – 21 ноября",
    description: "Скорпион страстен, загадочен и обладает огромной силой воли.",
  },
  {
    name: "Стрелец",
    symbol: "♐",
    start: "11-22",
    end: "12-21",
    dates: "22 ноября – 21 декабря",
    description: "Стрелец — философ и путешественник, ищущий истину.",
  },
  {
    name: "Козерог",
    symbol: "♑",
    start: "12-22",
    end: "01-19",
    dates: "22 декабря – 19 января",
    description: "Козерог дисциплинирован, амбициозен и достигает вершин.",
  },
  {
    name: "Водолей",
    symbol: "♒",
    start: "01-20",
    end: "02-18",
    dates: "20 января – 18 февраля",
    description: "Водолей новатор, гуманист и мыслитель будущего.",
  },
  {
    name: "Рыбы",
    symbol: "♓",
    start: "02-19",
    end: "03-20",
    dates: "19 февраля – 20 марта",
    description: "Рыбы интуитивны, артистичны и живут в мире грёз.",
  },
];

function getZodiacByDate(date) {
  if (!date) return null;
  const mmdd = date.slice(5);
  for (let sign of zodiacSigns) {
    if (
      (mmdd >= sign.start && mmdd <= sign.end) ||
      (sign.start > sign.end && (mmdd >= sign.start || mmdd <= sign.end))
    )
      return sign;
  }
  return null;
}

function renderZodiacCards() {
  const grid = document.getElementById("zodiacGrid");
  if (!grid) return;
  grid.innerHTML = "";
  zodiacSigns.forEach((sign) => {
    const card = document.createElement("div");
    card.className = "zodiac-card";
    card.innerHTML = `<div class="card-inner"><div class="zodiac-symbol">${sign.symbol}</div><div class="zodiac-name">${sign.name}</div><div class="zodiac-dates">${sign.dates}</div></div><div class="zodiac-overlay"><p>${sign.description}</p></div>`;
    grid.appendChild(card);
  });
}

function updateZodiacDisplay(date) {
  const sign = getZodiacByDate(date);
  const resultDiv = document.getElementById("zodiac-result");
  if (!resultDiv) return;
  if (sign) {
    resultDiv.innerHTML = `<div class="result-symbol">${sign.symbol}</div><div class="result-info"><h3>${sign.name}</h3><p>${sign.description}</p><span class="result-dates">${sign.dates}</span></div>`;
  } else {
    resultDiv.innerHTML = `<div class="result-symbol">🌙</div><div class="result-info"><h3>Неизвестно</h3><p>Выберите корректную дату</p></div>`;
  }
}

// ========== СЛАЙДЕР ФАКТОВ ==========
class FactsSlider {
  constructor(containerId, dotsContainerId) {
    this.slider = document.getElementById(containerId);
    this.dotsContainer = document.getElementById(dotsContainerId);
    this.leftBtn = document.querySelector(".slider-left");
    this.rightBtn = document.querySelector(".slider-right");
    this.facts = [
      {
        title: "Чёрная дыра",
        desc: "Гравитация настолько сильна, что даже свет не может покинуть её пределы.",
        localFile: "black-hole.jpg",
      },
      {
        title: "Сверхновая",
        desc: "Взрыв звезды в конце её жизни, временно затмевающий целую галактику.",
        localFile: "stars-new.jpg",
      },
      {
        title: "Столпы Творения",
        desc: "Облака газа в Орлиной туманности, где рождаются новые звёзды.",
        localFile: "stolpi.jpg",
      },
      {
        title: "Туманность Ориона",
        desc: "Ближайший к нам звёздный питомник, видимый невооружённым глазом.",
        localFile: "Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
      },
      {
        title: "Галактика Андромеды",
        desc: "Ближайшая крупная галактика, удалена на 2.5 млн световых лет.",
        localFile: "Andromeda.jpg",
      },
      {
        title: "Кольца Сатурна",
        desc: "Состоят из водяного льда и камней, толщина до 1 км.",
        localFile: "saturn-rings.jpg",
      },
      {
        title: "Экзопланета",
        desc: "Планеты за пределами Солнечной системы, некоторые пригодны для жизни.",
        localFile: "Exzoplanete.jpg",
      },
      {
        title: "Гамма-всплески",
        desc: "Самые мощные взрывы во Вселенной после Большого взрыва.",
        localFile: "GAMMA.jpg",
      },
      {
        title: "Марсианский закат",
        desc: "Закат на Марсе имеет голубоватый оттенок из-за рассеяния пыли.",
        localFile: "Mars.jpg",
      },
      {
        title: "Магеллановы облака",
        desc: "Карликовые галактики-спутники Млечного Пути, видны в южном полушарии.",
        localFile: "Magellanic_Clouds.jpg",
      },
      {
        title: "Тёмная материя",
        desc: "Невидимая субстанция, составляющая 27% массы Вселенной.",
        localFile: "dark-materia.jpg",
      },
      {
        title: "Квазары",
        desc: "Ярчайшие ядра далёких галактик, питаемые сверхмассивными чёрными дырами.",
        localFile: "qvasar.jpg",
      },
      {
        title: "Нейтронная звезда",
        desc: "Останки сверхновой, размером с город, но массой как Солнце.",
        localFile: "Neitrone-stars.jpg",
      },
      {
        title: "Большой аттрактор",
        desc: "Гравитационная аномалия, притягивающая наш Млечный Путь.",
        localFile: "Attraktor.jpg",
      },
      {
        title: "Звезда Бетельгейзе",
        desc: "Красный сверхгигант в созвездии Ориона, одна из самых больших известных звёзд.",
        localFile: "Betelgeise.jpg",
      },
    ];
    this.placeholderSVG =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e1e3a'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23a855f7' opacity='0.6'/%3E%3Ctext x='200' y='160' font-size='20' fill='white' text-anchor='middle' font-family='monospace'%3E🌟%3C/text%3E%3Ctext x='200' y='200' font-size='14' fill='%23cbd5e1' text-anchor='middle'%3EИзображение недоступно%3C/text%3E%3C/svg%3E";
    this.currentIndex = 0;
    this.renderSlides();
    this.initDots();
    this.initEvents();
    this.updateActiveDot();
    this.syncIndexOnScroll();
    window.addEventListener("resize", () =>
      this.scrollToSlide(this.currentIndex, false),
    );
  }
  getLocalImagePath(localFile) {
    return localFile ? `image/${encodeURIComponent(localFile)}` : null;
  }
  renderSlides() {
    this.slider.innerHTML = "";
    this.facts.forEach((fact) => {
      const slide = document.createElement("div");
      slide.className = "fact-slide";
      const img = document.createElement("img");
      const localSrc = fact.localFile
        ? this.getLocalImagePath(fact.localFile)
        : null;
      img.alt = fact.title;
      img.loading = "lazy";
      img.onerror = () => {
        img.src = this.placeholderSVG;
        img.onerror = null;
      };
      img.src = localSrc || this.placeholderSVG;
      const overlay = document.createElement("div");
      overlay.className = "fact-overlay";
      overlay.innerHTML = `<h3>${fact.title}</h3><p>${fact.desc}</p>`;
      slide.appendChild(img);
      slide.appendChild(overlay);
      this.slider.appendChild(slide);
    });
  }
  initDots() {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < this.facts.length; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.dataset.index = i;
      dot.addEventListener("click", () => {
        this.currentIndex = i;
        this.scrollToSlide(i);
      });
      this.dotsContainer.appendChild(dot);
    }
  }
  updateActiveDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      if (i === this.currentIndex) dot.classList.add("active");
      else dot.classList.remove("active");
    });
  }
  scrollToSlide(index, smooth = true) {
    const slides = this.slider.children;
    if (!slides[index]) return;
    const slide = slides[index];
    const containerRect = this.slider.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const offset = slideRect.left - containerRect.left + this.slider.scrollLeft;
    this.slider.scrollTo({
      left: offset,
      behavior: smooth ? "smooth" : "auto",
    });
    this.currentIndex = index;
    this.updateActiveDot();
  }
  syncIndexOnScroll() {
    let scrollTimer = null;
    this.slider.addEventListener("scroll", () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const slides = Array.from(this.slider.children);
        const center = this.slider.scrollLeft + this.slider.clientWidth / 2;
        let closestIndex = 0,
          minDist = Infinity;
        slides.forEach((slide, idx) => {
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          const dist = Math.abs(center - slideCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIndex = idx;
          }
        });
        if (closestIndex !== this.currentIndex) {
          this.currentIndex = closestIndex;
          this.updateActiveDot();
        }
      }, 50);
    });
  }
  initEvents() {
    this.leftBtn.addEventListener("click", () => {
      let newIdx =
        this.currentIndex > 0 ? this.currentIndex - 1 : this.facts.length - 1;
      this.scrollToSlide(newIdx);
    });
    this.rightBtn.addEventListener("click", () => {
      let newIdx =
        this.currentIndex < this.facts.length - 1 ? this.currentIndex + 1 : 0;
      this.scrollToSlide(newIdx);
    });
  }
}

// ========== ЗАПУСК ВСЕГО ПРИЛОЖЕНИЯ ==========
document.addEventListener("DOMContentLoaded", () => {
  new HeroNebula("hero-canvas");
  new StarBackground("stars-canvas", { starCount: 550 });
  const planetsContainer = document.getElementById("planets-container");
  if (planetsContainer) {
    new Planet(planetsContainer, getJupiterSVG(), 220, 18);
    new Planet(planetsContainer, getSaturnSVG(), 380, 28);
    new Planet(planetsContainer, getEarthSVG(), 560, 38);
  }
  // Intersection Observer включаем только на десктопе
  if (!isMobile()) {
    new ScrollAnimator();
  } else {
    // На мобильных показываем секции сразу
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.add("visible");
    });
  }
  const starMap = new StarDateMap("starCanvas");
  const datePicker = document.getElementById("date-picker");
  const generateBtn = document.getElementById("generate-sky");
  const today = new Date().toISOString().slice(0, 10);
  datePicker.value = today;
  starMap.generateByDate(today);
  generateBtn.addEventListener("click", () => {
    if (datePicker.value) starMap.updateDate(datePicker.value);
    else alert("Выберите дату");
  });
  renderZodiacCards();
  const zodiacDateInput = document.getElementById("zodiac-date-input");
  const findBtn = document.getElementById("find-zodiac-btn");
  zodiacDateInput.value = today;
  updateZodiacDisplay(today);
  findBtn.addEventListener("click", () => {
    if (zodiacDateInput.value) updateZodiacDisplay(zodiacDateInput.value);
    else alert("Введите дату");
  });
  new FactsSlider("factsSlider", "sliderDots");
});
