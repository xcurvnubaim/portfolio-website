export function createStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  const flareColors = [
    "120, 210, 255",
    "160, 130, 255",
    "255, 185, 120",
    "255, 110, 155",
    "155, 255, 205"
  ];
  const state = {
    animationFrame: 0,
    lastFrameTime: 0,
    shootingStarTimer: 0,
    stars: [],
    shootingStars: [],
    mouse: { x: -1000, y: -1000 }
  };

  function randomStarPosition(spawnNearCenter = false) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.hypot(centerX, centerY);
    const angle = Math.random() * Math.PI * 2;
    const radius = spawnNearCenter
      ? Math.random() * 60
      : Math.sqrt(Math.random()) * maxRadius;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  function createStar(spawnNearCenter = false) {
    const baseAlpha = Math.random() * 0.5 + 0.1;
    const depth = Math.random() * 0.8 + 0.2;
    const position = randomStarPosition(spawnNearCenter);

    return {
      x: position.x,
      y: position.y,
      previousX: position.x,
      previousY: position.y,
      size: Math.random() * 1.5 + 0.5,
      alpha: baseAlpha,
      baseAlpha,
      depth,
      flareColor: flareColors[Math.floor(Math.random() * flareColors.length)],
      flareCooldown: Math.random() * 9000 + 2000,
      flareDuration: 0,
      flareElapsed: 0,
      flareIntensity: 0,
      isFlaring: false,
      speed: 0.018 + depth * depth * 0.0055,
      twinkleOffset: Math.random() * Math.PI * 2
    };
  }

  function initStars() {
    state.stars = Array.from({ length: 250 }, createStar);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function scheduleShootingStar() {
    state.shootingStarTimer = window.setTimeout(() => {
      state.shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        vx: Math.cos(Math.PI / 4) * (15 + Math.random() * 10),
        vy: Math.sin(Math.PI / 4) * (15 + Math.random() * 10),
        life: 1,
        decay: 0.02 + Math.random() * 0.02
      });
      scheduleShootingStar();
    }, 500 + Math.random() * 3000);
  }

  function resetStar(star) {
    Object.assign(star, createStar(true));
  }

  function updateStarFlare(star, deltaTime) {
    if (star.isFlaring) {
      star.flareElapsed += deltaTime;
      const progress = Math.min(star.flareElapsed / star.flareDuration, 1);
      star.flareIntensity = Math.sin(progress * Math.PI);

      if (progress >= 1) {
        star.isFlaring = false;
        star.flareElapsed = 0;
        star.flareIntensity = 0;
        star.flareCooldown = Math.random() * 10000 + 4000;
      }

      return;
    }

    star.flareCooldown -= deltaTime;

    if (star.flareCooldown <= 0 && Math.random() < 0.08) {
      star.isFlaring = true;
      star.flareDuration = Math.random() * 1200 + 700;
      star.flareElapsed = 0;
      star.flareColor = flareColors[Math.floor(Math.random() * flareColors.length)];
    }
  }

  function drawStarFlare(drawX, drawY, star) {
    const flareRadius = (star.size * 5 + 8) * star.depth * star.flareIntensity;
    const coreRadius = (star.size * star.depth + 2) * (1 + star.flareIntensity * 1.6);
    const rayAlpha = star.alpha * star.flareIntensity;

    ctx.save();
    ctx.translate(drawX, drawY);
    ctx.rotate(star.twinkleOffset);

    ctx.beginPath();
    ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${star.flareColor}, ${rayAlpha * 0.14})`;
    ctx.fill();

    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(-flareRadius, 0);
    ctx.lineTo(flareRadius, 0);
    ctx.moveTo(0, -flareRadius);
    ctx.lineTo(0, flareRadius);
    ctx.strokeStyle = `rgba(${star.flareColor}, ${rayAlpha * 0.72})`;
    ctx.lineWidth = Math.max(0.8, star.depth * 1.4);
    ctx.stroke();

    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-flareRadius * 0.48, 0);
    ctx.lineTo(flareRadius * 0.48, 0);
    ctx.moveTo(0, -flareRadius * 0.48);
    ctx.lineTo(0, flareRadius * 0.48);
    ctx.strokeStyle = `rgba(255, 255, 255, ${rayAlpha * 0.42})`;
    ctx.lineWidth = Math.max(0.5, star.depth * 0.8);
    ctx.stroke();

    ctx.restore();
  }

  function drawStar(star, deltaTime, elapsedTime) {
    updateStarFlare(star, deltaTime);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fromCenterX = star.x - centerX;
    const fromCenterY = star.y - centerY;
    const distanceFromCenter = Math.max(1, Math.hypot(fromCenterX, fromCenterY));
    const directionX = fromCenterX / distanceFromCenter;
    const directionY = fromCenterY / distanceFromCenter;
    const parallaxX = (state.mouse.x - centerX) * 0.00008 * star.depth * deltaTime;
    const parallaxY = (state.mouse.y - centerY) * 0.00008 * star.depth * deltaTime;
    const movement = star.speed * deltaTime * (1 + distanceFromCenter / 900);

    star.previousX = star.x;
    star.previousY = star.y;
    star.x += directionX * movement + parallaxX;
    star.y += directionY * movement + parallaxY;

    if (
      star.x < -40 ||
      star.x > canvas.width + 40 ||
      star.y < -40 ||
      star.y > canvas.height + 40
    ) {
      resetStar(star);
    }

    const dx = star.x - state.mouse.x;
    const dy = star.y - state.mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const twinkle = Math.sin(elapsedTime * 0.0015 + star.twinkleOffset) * 0.12;
    let targetAlpha = Math.max(0.08, star.baseAlpha + twinkle);
    let offsetX = 0;
    let offsetY = 0;

    if (dist > 0 && dist < 150) {
      const force = (150 - dist) / 150;
      targetAlpha = Math.min(1, star.baseAlpha + force * 0.8);
      offsetX = (dx / dist) * force * 8;
      offsetY = (dy / dist) * force * 8;
    }

    star.alpha += (targetAlpha - star.alpha) * 0.1;
    const drawX = star.x + offsetX;
    const drawY = star.y + offsetY;
    const previousDrawX = star.previousX + offsetX * 0.5;
    const previousDrawY = star.previousY + offsetY * 0.5;

    const starColor = star.flareIntensity > 0.02 ? star.flareColor : "255, 255, 255";
    const glowAlpha = star.alpha * star.flareIntensity;

    if (star.depth > 0.65) {
      ctx.beginPath();
      ctx.moveTo(previousDrawX, previousDrawY);
      ctx.lineTo(drawX, drawY);
      ctx.strokeStyle = `rgba(${starColor}, ${star.alpha * 0.35})`;
      ctx.lineWidth = star.depth;
      ctx.stroke();
    }

    if (star.flareIntensity > 0.02) {
      drawStarFlare(drawX, drawY, star);
    }

    ctx.beginPath();
    ctx.arc(drawX, drawY, star.size * star.depth * (1 + star.flareIntensity * 0.7), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${starColor}, ${Math.min(1, star.alpha + star.flareIntensity * 0.35)})`;
    ctx.fill();
  }

  function drawShootingStars() {
    for (let i = state.shootingStars.length - 1; i >= 0; i -= 1) {
      const shootingStar = state.shootingStars[i];
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      shootingStar.life -= shootingStar.decay;

      if (shootingStar.life <= 0) {
        state.shootingStars.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x - shootingStar.vx * 2, shootingStar.y - shootingStar.vy * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.life})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function animateStars(timestamp = 0) {
    const deltaTime = state.lastFrameTime ? Math.min(timestamp - state.lastFrameTime, 50) : 16;
    state.lastFrameTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.stars.forEach((star) => drawStar(star, deltaTime, timestamp));
    drawShootingStars();
    state.animationFrame = window.requestAnimationFrame(animateStars);
  }

  function trackMouse(event) {
    state.mouse.x = event.clientX;
    state.mouse.y = event.clientY;
  }

  function init() {
    resizeCanvas();
    animateStars();
    state.shootingStarTimer = window.setTimeout(scheduleShootingStar, 2000);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", trackMouse);

    return () => {
      window.cancelAnimationFrame(state.animationFrame);
      window.clearTimeout(state.shootingStarTimer);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", trackMouse);
    };
  }

  return { init };
}
