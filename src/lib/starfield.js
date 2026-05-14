export function createStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  const state = {
    animationFrame: 0,
    shootingStarTimer: 0,
    stars: [],
    shootingStars: [],
    mouse: { x: -1000, y: -1000 }
  };

  function createStar() {
    const baseAlpha = Math.random() * 0.5 + 0.1;

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      alpha: baseAlpha,
      baseAlpha
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
    }, 3000 + Math.random() * 4000);
  }

  function drawStar(star) {
    const dx = star.x - state.mouse.x;
    const dy = star.y - state.mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let targetAlpha = star.baseAlpha;
    let offsetX = 0;
    let offsetY = 0;

    if (dist > 0 && dist < 150) {
      const force = (150 - dist) / 150;
      targetAlpha = Math.min(1, star.baseAlpha + force * 0.8);
      offsetX = (dx / dist) * force * 8;
      offsetY = (dy / dist) * force * 8;
    }

    star.alpha += (targetAlpha - star.alpha) * 0.1;
    ctx.beginPath();
    ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
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

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.stars.forEach(drawStar);
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
