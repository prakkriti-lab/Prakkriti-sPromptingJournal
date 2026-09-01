import { initCloudEnvironment } from './cloud-imports.js';
import { initStorage } from './storage.js';
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

// Global robot state
export const robot = {
  parts: [],
  joints: [],
  sensors: [],
  timeline: [],
  mode: 'edit'
};
window.robot = robot;

async function init() {
  try {
    console.log('[ROBOPTIXX] Starting initialization...');
    
    // Initialize cloud environment (CDN imports + WASM)
    await initCloudEnvironment();
    console.log('[ROBOPTIXX] ✓ Cloud environment ready');
    
    // Initialize storage (IndexedDB)
    await initStorage();
    console.log('[ROBOPTIXX] ✓ Storage ready');
    
    // Setup DOM elements
    const canvas = document.getElementById('viewport');
    const minimapCanvas = document.getElementById('minimap');
    const snapIndicator = document.getElementById('snap-indicator');
    
    if (!canvas) throw new Error('Viewport canvas not found');
    
    // Initialize systems
    const sceneSystem = new SceneSystem(canvas, robot);
    await sceneSystem.init();
    
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
    
    // Create context for UI
    const ctx = {
      robot,
      sceneSystem,
      physicsSystem,
      partsSystem,
      jointSystem,
      servoSystem,
      sensorSystem,
      minimapSystem,
      snapSystem,
      timelineSystem,
      projectManager,
      toggleMode: () => {
        robot.mode = robot.mode === 'edit' ? 'simulate' : 'edit';
        physicsSystem.enabled = robot.mode === 'simulate';
        sceneSystem.transformControls.enabled = robot.mode === 'edit';
        if (sceneSystem.controls) sceneSystem.controls.enabled = true;
      }
    };
    
    // Initialize UI
    const uiSystem = new UISystem(ctx);
    ctx.uiSystem = uiSystem;
    
    // Setup input handlers
    canvas.addEventListener('pointerdown', (e) => {
      const part = sceneSystem.getIntersectedPart(e.clientX, e.clientY);
      if (!part) {
        sceneSystem.clearSelection();
        return;
      }
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
    
    // Seed with starter core
    partsSystem.createPart('Cube', 'Cores', 2);
    
    // Animation loop
    let last = performance.now();
    function animate(now) {
      const dt = Math.min((now - last) / 1000, 0.016); // Cap at 60fps
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
    
    console.log('[ROBOPTIXX] ✓ Initialization complete!');
    
  } catch (error) {
    console.error('[ROBOPTIXX] Initialization failed:', error);
    document.body.innerHTML = `
      <div style="color: #f44336; font-family: monospace; padding: 20px;">
        <h2>RobotSim Initialization Error</h2>
        <pre>${error.message}</pre>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}

// Start initialization
init();
