// Lightweight educational Three-like module for offline demos.
export class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  length() { return Math.hypot(this.x, this.y, this.z); }
  normalize() { const l = this.length() || 1; return this.multiplyScalar(1 / l); }
  distanceTo(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z); }
}
export class Color {
  constructor(hex = 0xffffff) { this.set(hex); }
  set(hex) { this.hex = typeof hex === 'number' ? hex : 0xffffff; return this; }
  getStyle() { const r = (this.hex >> 16) & 255; const g = (this.hex >> 8) & 255; const b = this.hex & 255; return `rgb(${r},${g},${b})`; }
}
export class Object3D {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.children = [];
    this.parent = null;
    this.userData = {};
  }
  add(obj) { obj.parent = this; this.children.push(obj); }
  remove(obj) { this.children = this.children.filter((c) => c !== obj); obj.parent = null; }
}
export class Scene extends Object3D { constructor() { super(); this.background = new Color(0x202020); } }
export class Geometry { constructor(type, args = []) { this.type = type; this.args = args; } }
export class BoxGeometry extends Geometry { constructor(w, h, d) { super('box', [w, h, d]); } }
export class CylinderGeometry extends Geometry { constructor(r1, r2, h) { super('cylinder', [r1, r2, h]); } }
export class SphereGeometry extends Geometry { constructor(r) { super('sphere', [r]); } }
export class CapsuleGeometry extends Geometry { constructor(r, l) { super('capsule', [r, l]); } }
export class PlaneGeometry extends Geometry { constructor(w, h) { super('plane', [w, h]); } }
export class Material { constructor(params = {}) { this.color = new Color(params.color ?? 0xcccccc); this.wireframe = !!params.wireframe; } }
export class MeshStandardMaterial extends Material {}
export class MeshBasicMaterial extends Material {}
export class Mesh extends Object3D {
  constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; this.castShadow = false; this.receiveShadow = false; }
}
export class GridHelper extends Object3D { constructor(size, div) { super(); this.size = size; this.divisions = div; } }
export class AmbientLight extends Object3D { constructor(color = 0xffffff, intensity = 1) { super(); this.color = new Color(color); this.intensity = intensity; } }
export class DirectionalLight extends Object3D { constructor(color = 0xffffff, intensity = 1) { super(); this.color = new Color(color); this.intensity = intensity; this.position.set(4, 8, 2); } }
export class PerspectiveCamera extends Object3D {
  constructor(fov, aspect, near, far) { super(); this.fov = fov; this.aspect = aspect; this.near = near; this.far = far; }
  updateProjectionMatrix() {}
}
export class Raycaster {
  constructor() { this.origin = new Vector3(); this.direction = new Vector3(0, -1, 0); }
  setFromCamera(ndc, camera) { this.origin.copy(camera.position); this.direction.set(ndc.x, ndc.y, -1).normalize(); }
  intersectObjects(objects) {
    return objects.map((o) => ({ object: o, distance: o.position.distanceTo(this.origin), point: o.position.clone() })).sort((a, b) => a.distance - b.distance);
  }
}
export class Clock { constructor() { this.last = performance.now(); } getDelta() { const n = performance.now(); const d = (n - this.last) / 1000; this.last = n; return d; } }
export class WebGLRenderer {
  constructor({ canvas }) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.width = canvas.clientWidth || 1; this.height = canvas.clientHeight || 1; }
  setSize(w, h) { this.canvas.width = w; this.canvas.height = h; this.width = w; this.height = h; }
  render(scene, camera) {
    const ctx = this.ctx;
    ctx.fillStyle = scene.background.getStyle();
    ctx.fillRect(0, 0, this.width, this.height);
    for (const c of scene.children) {
      if (!(c instanceof Mesh)) continue;
      const x = this.width / 2 + (c.position.x - camera.position.x) * 30;
      const y = this.height / 2 + (c.position.z - camera.position.z) * 30;
      ctx.fillStyle = c.material.color.getStyle();
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    }
  }
}
