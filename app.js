const canvas = document.querySelector("#heroCanvas");
const ctx = canvas.getContext("2d");

const palette = ["#6fd0bd", "#f0b05f", "#f07b5f", "#d8f0e8"];
let nodes = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createNodes();
}

function createNodes() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  const count = Math.max(18, Math.floor(width / 28));

  nodes = Array.from({ length: count }, (_, index) => ({
    x: (index * 53) % width,
    y: 80 + ((index * 97) % Math.max(160, height - 120)),
    radius: 2.5 + (index % 4),
    color: palette[index % palette.length],
    speed: 0.18 + (index % 5) * 0.035,
    phase: index * 0.65
  }));
}

function draw() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#173b36";
  ctx.fillRect(0, 0, width, height);

  nodes.forEach((node, index) => {
    const x = node.x + Math.sin(Date.now() * 0.0005 + node.phase) * 18;
    const y = node.y + Math.cos(Date.now() * 0.00045 + node.phase) * 14;

    for (let j = index + 1; j < nodes.length; j += 1) {
      const other = nodes[j];
      const ox = other.x + Math.sin(Date.now() * 0.0005 + other.phase) * 18;
      const oy = other.y + Math.cos(Date.now() * 0.00045 + other.phase) * 14;
      const distance = Math.hypot(x - ox, y - oy);

      if (distance < 138) {
        ctx.strokeStyle = `rgba(216, 240, 232, ${0.16 * (1 - distance / 138)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    }

    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.58;
    ctx.beginPath();
    ctx.arc(x, y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(draw);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
draw();
