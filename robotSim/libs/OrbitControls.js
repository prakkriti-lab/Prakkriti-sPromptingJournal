import { Vector3 } from './three.module.js';
export class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new Vector3();
    this.enabled = true;
    this._setup();
  }
  _setup() {
    let dragging = false;
    let lx = 0;
    let lz = 0;
    this.domElement.addEventListener('pointerdown', (e) => { if (!this.enabled) return; dragging = true; lx = e.clientX; lz = e.clientY; });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointermove', (e) => {
      if (!dragging || !this.enabled) return;
      this.camera.position.x += (e.clientX - lx) * 0.01;
      this.camera.position.z += (e.clientY - lz) * 0.01;
      lx = e.clientX; lz = e.clientY;
    });
  }
  update() {}
}
