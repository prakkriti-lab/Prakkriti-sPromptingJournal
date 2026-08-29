import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { TransformControls } from './libs/TransformControls.js';

export class SceneSystem {
  constructor(canvas, robot) {
    this.canvas = canvas;
    this.robot = robot;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.position.set(6, 6, 6);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.controls = new OrbitControls(this.camera, canvas);
    this.transformControls = new TransformControls(this.camera, canvas);
    this.raycaster = new THREE.Raycaster();
    this.pointer = { x: 0, y: 0 };
    this.selected = [];
    this._initScene();
    this._bindResize();
  }

  _initScene() {
    this.scene.background.set(0x1c2130);
    this.scene.add(new THREE.GridHelper(30, 30));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scene.add(new THREE.DirectionalLight(0xffffff, 0.8));
  }

  _bindResize() {
    const resize = () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();
  }

  getIntersectedPart(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.robot.parts.map((p) => p.mesh));
    if (!hits.length) return null;
    return this.robot.parts.find((p) => p.mesh === hits[0].object) || null;
  }

  setSelected(part, additive = false) {
    if (!additive) this.clearSelection();
    if (!part) return;
    if (!this.selected.includes(part)) this.selected.push(part);
    part.mesh.material.color.set(0xffd166);
    this.transformControls.attach(part.mesh);
  }

  clearSelection() {
    this.selected.forEach((p) => p.mesh.material.color.set(0x7db2ff));
    this.selected = [];
    this.transformControls.detach();
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
