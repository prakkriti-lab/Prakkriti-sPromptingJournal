export class MinimapSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.visible = true;
    this.gridSize = 22;
  }

  setVisible(v) { this.visible = v; this.canvas.style.display = v ? 'block' : 'none'; }

  render(robot, laserDistances = []) {
    if (!this.visible) return;
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#3f4a59';
    for (let x = 0; x <= width; x += this.gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y <= height; y += this.gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    const core = robot.parts[0];
    if (!core) return;
    const cx = width / 2;
    const cy = height / 2;
    ctx.fillStyle = '#67b7ff';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

    const dirs = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    ctx.fillStyle = '#ff8f8f';
    laserDistances.forEach((d, i) => {
      const dx = dirs[i][0] * d * 10;
      const dy = dirs[i][1] * d * 10;
      ctx.fillRect(cx + dx - 2, cy + dy - 2, 4, 4);
    });
  }
}
