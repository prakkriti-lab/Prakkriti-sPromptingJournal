import { SceneSystem } from './scene.js';
import { PhysicsSystem } from './physics.js';
import { PartsSystem } from './parts.js';
import { JointSystem } from './joints.js';
import { ServoSystem } from './servoSystem.js';
import { SensorSystem } from './sensors.js';
import { MinimapSystem } from './minimap.js';
import { SnapSystem } from './snapSystem.js';
import { TimelineSystem } from './timeline.js';
import { UISystem } from './ui.js';
import { ArduinoCodeGenerator } from './codeGenerator.js';
import { ProjectManager } from './projectManager.js';

export const robot = {
  parts: [],
  joints: [],
  sensors: [],
  timeline: [],
  mode: 'edit'
};
window.robot = robot;

const canvas = document.getElementById('viewport');
const minimapCanvas = document.getElementById('minimap');
const snapIndicator = document.getElementById('snap-indicator');

const sceneSystem = new SceneSystem(canvas, robot);
const physicsSystem = new PhysicsSystem(robot);
await physicsSystem.init();
const partsSystem = new PartsSystem(sceneSystem.scene, physicsSystem, robot);
const jointSystem = new JointSystem(robot);
const timelineSystem = new TimelineSystem(robot);
const servoSystem = new ServoSystem(robot, timelineSystem);
const sensorSystem = new SensorSystem(robot);
const minimapSystem = new MinimapSystem(minimapCanvas);
const snapSystem = new SnapSystem(robot, snapIndicator);
const codeGenerator = new ArduinoCodeGenerator(robot);
const projectManager = new ProjectManager(robot, partsSystem, jointSystem, codeGenerator);

const ctx = {
  robot, sceneSystem, physicsSystem, partsSystem, jointSystem, servoSystem, sensorSystem,
  minimapSystem, snapSystem, timelineSystem, projectManager,
  toggleMode: () => {
    robot.mode = robot.mode === 'edit' ? 'simulate' : 'edit';
    physicsSystem.enabled = robot.mode === 'simulate';
    sceneSystem.transformControls.enabled = robot.mode === 'edit';
    sceneSystem.controls.enabled = true;
  }
};

const uiSystem = new UISystem(ctx);
ctx.uiSystem = uiSystem;

canvas.addEventListener('pointerdown', (e) => {
  const part = sceneSystem.getIntersectedPart(e.clientX, e.clientY);
  if (!part) { sceneSystem.clearSelection(); return; }
  sceneSystem.setSelected(part, e.shiftKey);
  uiSystem.inspectPart(part);
});

canvas.addEventListener('pointermove', (e) => {
  const selected = sceneSystem.selected[0];
  if (!selected || robot.mode !== 'edit') return;
  const match = snapSystem.findSnap(selected);
  snapSystem.showIndicator(e.clientX, e.clientY, !!match);
  snapSystem.applySnap(match, e.altKey);
});

// Seed starter robot core.
partsSystem.createPart('Cube', 'Cores', 2);

let last = performance.now();
function animate(now) {
  const dt = (now - last) / 1000;
  last = now;

  physicsSystem.step(dt);
  servoSystem.step(dt);
  timelineSystem.step();

  let laser = [];
  if (robot.parts[0]) {
    laser = sensorSystem.readLaserOdometry(robot.parts[0]);
  }
  minimapSystem.render(robot, laser);
  sceneSystem.render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
