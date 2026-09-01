export class SnapSystem {
  constructor(robot, indicatorEl) {
    this.robot = robot;
    this.indicatorEl = indicatorEl;
    this.threshold = 0.7;
    this.enabled = true;
  }

  findSnap(part) {
    if (!this.enabled) return null;
    let best = null;
    for (const other of this.robot.parts) {
      if (other.id === part.id) continue;
      for (const ap of part.attachmentPoints) {
        for (const bop of other.attachmentPoints) {
          const wp = part.mesh.position.clone().add(ap.position);
          const wo = other.mesh.position.clone().add(bop.position);
          const d = wp.distanceTo(wo);
          if (d < this.threshold && (!best || d < best.distance)) {
            best = { distance: d, part, other, ap, bop, target: wo };
          }
        }
      }
    }
    return best;
  }

  applySnap(match, manualOverride = false) {
    if (!match || manualOverride) return;
    match.part.mesh.position.copy(match.target.clone().sub(match.ap.position));
  }

  showIndicator(clientX, clientY, visible) {
    this.indicatorEl.style.display = visible ? 'block' : 'none';
    if (visible) {
      this.indicatorEl.style.left = `${clientX}px`;
      this.indicatorEl.style.top = `${clientY}px`;
    }
  }
}
