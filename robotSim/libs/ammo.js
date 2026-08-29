// Tiny Ammo-like approximation for educational offline simulation.
export default async function Ammo() {
  class RigidBody {
    constructor(mesh, mass = 1) {
      this.mesh = mesh;
      this.mass = mass;
      this.velocity = { x: 0, y: 0, z: 0 };
      this.damping = 0.93;
    }
  }
  class World {
    constructor() { this.gravity = { x: 0, y: -9.8, z: 0 }; this.bodies = []; }
    addRigidBody(body) { this.bodies.push(body); }
    removeRigidBody(body) { this.bodies = this.bodies.filter((b) => b !== body); }
    setGravity(v) { this.gravity = v; }
    stepSimulation(dt) {
      this.bodies.forEach((b) => {
        if (b.mass <= 0) return;
        b.velocity.y += this.gravity.y * dt;
        b.mesh.position.y += b.velocity.y * dt;
        b.velocity.x *= b.damping; b.velocity.y *= b.damping; b.velocity.z *= b.damping;
        if (b.mesh.position.y < 0) { b.mesh.position.y = 0; b.velocity.y *= -0.2; }
      });
    }
  }
  return { World, RigidBody };
}
