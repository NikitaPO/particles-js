(function () {
  properties = {
    bgColor: "rgba(2, 2, 3, 1)",
    lineColor: "rgb(0, 255, 64)",
    lineLength: 150,
    lineWidth: 0.5,
    lineOpacityChange: true,
    particleColor: "rgba(0, 255, 64, 1)",
    particleRadius: 2,
    particleCount: 180,
    particleMaxVelocity: 0.2,
    particleLife: 100,
  };

  let canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  w = canvas.width = document.querySelector(".particles").offsetWidth;
  h = canvas.height = document.querySelector(".particles").offsetHeight;
  particles = [];
  document.querySelector(".particles").appendChild(canvas);

  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  };

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.velocityX =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity;
      this.velocityY =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity;
      this.life = Math.random() * properties.particleLife * 60;
    }

    newPosition() {
      //boundaries
      if (this.x + this.velocityX > w || this.x + this.velocityX < 0) {
        this.velocityX *= -1;
      }
      if (this.y + this.velocityY > h || this.y + this.velocityY < 0) {
        this.velocityY *= -1;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }
    reCalculateLife() {
      if (this.life < 1) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.velocityX =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.velocityY =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
      }
      this.life--;
    }
  }

  function reDrawBackground() {
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  function reDrawParticles() {
    particles.forEach((particle) => {
      particle.reCalculateLife();
      particle.newPosition();
      particle.reDraw();
    });
  }

  function drawLines() {
    let x1, y1, x2, y2, length, opacity;
    for (let particleI of particles) {
      for (let particleJ of particles) {
        x1 = particleI.x;
        y1 = particleI.y;
        x2 = particleJ.x;
        y2 = particleJ.y;

        length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        if (length < properties.lineLength) {
          if (properties.lineOpacityChange) {
            opacity = 1 - length / properties.lineLength;
            ctx.globalAlpha = opacity;
          }
          ctx.lineWidth = properties.lineWidth;
          ctx.strokeStyle = properties.lineColor;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    reDrawBackground();
    reDrawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  function init() {
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push(new Particle());
    }
    loop();
  }

  init();
})();
