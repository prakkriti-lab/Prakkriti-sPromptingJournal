import { Ammo } from './cloud-imports.js';

export class PhysicsSystem {
  constructor(robot) {
    this.robot = robot;
    this.ammoLib = null;
    this.world = null;
    this.enabled = false;
    this.gravityEnabled = true;
    this.bodies = new Map();
  }

  async init() {
    try {
      if (!Ammo) throw new Error('Ammo.js not initialized');
      this.ammoLib = Ammo;
      
      // Create physics world
      const collisionConfiguration = new this.ammoLib.btDefaultCollisionConfiguration();
      const dispatcher = new this.ammoLib.btCollisionDispatcher(collisionConfiguration);
      const broadphase = new this.ammoLib.btDbvtBroadphase();
      const solver = new this.ammoLib.btSequentialImpulseConstraintSolver();
      
      this.world = new this.ammoLib.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
      this.world.setGravity(new this.ammoLib.btVector3(0, -9.8, 0));
      
      console.log('[ROBOPTIXX] Physics system initialized');
    } catch (error) {
      console.error('[ROBOPTIXX] Physics initialization failed:', error);
      throw error;
    }
  }

  createBody(mesh, mass) {
    try {
      // Simple shape approximation - use box for all geometries
      const shape = new this.ammoLib.btBoxShape(
        new this.ammoLib.btVector3(0.5, 0.5, 0.5)
      );
      
      const localInertia = new this.ammoLib.btVector3(0, 0, 0);
      if (mass !== 0) shape.calculateLocalInertia(mass, localInertia);
      
      const transform = new this.ammoLib.btTransform();
      transform.setIdentity();
      transform.setOrigin(new this.ammoLib.btVector3(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
      ));
      
      const motionState = new this.ammoLib.btDefaultMotionState(transform);
      const info = new this.ammoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new this.ammoLib.btRigidBody(info);
      
      this.world.addRigidBody(body);
      this.bodies.set(body, mesh);
      
      return body;
    } catch (error) {
      console.warn('[ROBOPTIXX] Failed to create physics body:', error);
      return null;
    }
  }

  removeBody(body) {
    if (!body) return;
    try {
      this.world.removeRigidBody(body);
      this.bodies.delete(body);
    } catch (error) {
      console.warn('[ROBOPTIXX] Error removing physics body:', error);
    }
  }

  setGravityEnabled(enabled) {
    this.gravityEnabled = enabled;
    if (this.world) {
      this.world.setGravity(new this.ammoLib.btVector3(0, enabled ? -9.8 : 0, 0));
    }
  }

  step(deltaSeconds) {
    if (!this.enabled || !this.world || deltaSeconds > 0.1) return;
    
    try {
      this.world.stepSimulation(deltaSeconds, 10);
      
      // Update mesh positions from physics
      this.bodies.forEach((mesh, body) => {
        if (!mesh) return;
        const motionState = body.getMotionState();
        if (motionState) {
          const transform = new this.ammoLib.btTransform();
          motionState.getWorldTransform(transform);
          const origin = transform.getOrigin();
          mesh.position.set(origin.x(), origin.y(), origin.z());
        }
        
        // Calculate pressure from velocity
        if (mesh.userData.partId) {
          const part = this.robot.parts.find(p => p.id === mesh.userData.partId);
          if (part) {
            const linearVelocity = body.getLinearVelocity();
            part.lastPressure = Math.abs(linearVelocity.y()) * part.mass;
          }
        }
      });
    } catch (error) {
      console.warn('[ROBOPTIXX] Physics step error:', error);
    }
  }
}
