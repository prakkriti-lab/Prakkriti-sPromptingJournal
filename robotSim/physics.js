import AmmoInit from './libs/ammo.js';

export class PhysicsSystem {
  constructor(robot) {
    this.robot = robot;
    this.ammo = null;
    this.world = null;
    this.enabled = false;
    this.gravityEnabled = true;
  }

  async init() {
    this.ammo = await AmmoInit();
    this.world = new this.ammo.World();
  }

  createBody(mesh, mass) {
    const body = new this.ammo.RigidBody(mesh, mass);
    this.world.addRigidBody(body);
    return body;
  }

  removeBody(body) {
    this.world.removeRigidBody(body);
  }

  setGravityEnabled(enabled) {
    this.gravityEnabled = enabled;
    this.world.setGravity({ x: 0, y: enabled ? -9.8 : 0, z: 0 });
  }

  step(deltaSeconds) {
    if (!this.enabled || !this.world) return;
    this.world.stepSimulation(deltaSeconds);
    // approximate collision pressure for sensors
    this.robot.parts.forEach((part) => {
      part.lastPressure = part.mesh.position.y <= 0 ? Math.abs(part.physicsBody.velocity.y * part.mass) : 0;
    });
  }
}
