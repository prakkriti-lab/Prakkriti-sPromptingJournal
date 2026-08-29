import { THREE } from './cloud-imports.js';

const SHAPE_MAP = {
  Cube: () => new THREE.BoxGeometry(1, 1, 1),
  Cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1),
  Sphere: () => new THREE.SphereGeometry(0.5),
  Capsule: () => new THREE.CapsuleGeometry(0.35, 0.8),
  Plate: () => new THREE.BoxGeometry(1.4, 0.2, 1.4)
};

export const PART_CATEGORIES = ['Tools', 'Cushioning', 'Cores', 'Limbs', 'Joints', 'Sensors'];

export class PartsSystem {
  constructor(scene, physics, robot) {
    this.scene = scene;
    this.physics = physics;
    this.robot = robot;
    this.idCounter = 1;
  }

  createPart(shape, category = 'Cores', mass = 1) {
    if (!SHAPE_MAP[shape]) {
      console.warn(`Unknown shape: ${shape}, defaulting to Cube`);
      shape = 'Cube';
    }

    const geometry = SHAPE_MAP[shape]();
    const material = new THREE.MeshStandardMaterial({ color: 0x7db2ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 3, 1, (Math.random() - 0.5) * 3);
    this.scene.add(mesh);

    const part = {
      id: `part_${this.idCounter++}`,
      mesh,
      physicsBody: this.physics.createBody(mesh, mass),
      category,
      mass,
      attachmentPoints: this._buildAttachmentPoints(),
      shape,
      lastPressure: 0
    };

    mesh.userData.partId = part.id;
    this.robot.parts.push(part);
    return part;
  }

  removePart(partId) {
    const idx = this.robot.parts.findIndex((p) => p.id === partId);
    if (idx === -1) return;
    const part = this.robot.parts[idx];
    this.physics.removeBody(part.physicsBody);
    this.scene.remove(part.mesh);
    this.robot.parts.splice(idx, 1);
    this.robot.joints = this.robot.joints.filter((j) => j.partA !== partId && j.partB !== partId);
  }

  _buildAttachmentPoints() {
    return [
      { position: new THREE.Vector3(0.5, 0, 0), normal: new THREE.Vector3(1, 0, 0), type: 'fixed' },
      { position: new THREE.Vector3(-0.5, 0, 0), normal: new THREE.Vector3(-1, 0, 0), type: 'fixed' },
      { position: new THREE.Vector3(0, 0.5, 0), normal: new THREE.Vector3(0, 1, 0), type: 'rotational' },
      { position: new THREE.Vector3(0, -0.5, 0), normal: new THREE.Vector3(0, -1, 0), type: 'rotational' }
    ];
  }
}
