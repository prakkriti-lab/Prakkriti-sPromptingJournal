import { THREE } from './cloud-imports.js';

const SHAPE_MAP = {
  Cube: () => new THREE.BoxGeometry(1, 1, 1),
  Cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1),
  Sphere: () => new THREE.SphereGeometry(0.5),
  Capsule: () => new THREE.CapsuleGeometry(0.35, 0.8),
  Plate: () => new THREE.BoxGeometry(1.4, 0.2, 1.4)
};

export const PART_CATEGORIES = ['Cores', 'Limbs', 'Joints', 'Cushioning', 'Sensors', 'Tools'];

export class PartsSystem {
  constructor(scene, physics, robot) {
    this.scene = scene;
    this.physics = physics;
    this.robot = robot;
    this.idCounter = 1;
    
    // Custom Robot Part Naming Scheme
    this.partNamingScheme = {
      'Cores': [
        'Anchor_Hook',
        'Spade'
      ],
      'Limbs': [
        'Lifting_Limb',
        'Running_Limb',
        'Hilly_Region_Limb',
        'Crew_Limb',
        'Spider_Limb',
        'Clawed_Limb',
        'Paddle_Limb',
        'Screw_Limb'
      ],
      'Joints': [
        'Rolling_Hinge',
        'Gear_Axle',
        'Wheel_Roller'
      ],
      'Cushioning': [
        'Cushioning_Roller_2'
      ],
      'Tools': [
        'Cartwheel',
        'Airshot'
      ]
    };
    
    this.partNameCounters = {};
    
    // IMAGE FILENAME MAPPING (Exact filenames from user's Assets)
    this.partAssets = {
      'Anchor_Hook': 'Anchor Hook',
      'Spade': 'Spade',
      'Clawed_Limb': 'Clawed Limb',
      'Crew_Limb': 'Crew Limb',
      'Lifting_Limb': 'Lifting Limb',
      'Hilly_Region_Limb': 'Sandy/Hilly Region Limb',
      'Spider_Limb': 'Spider Limb',
      'Running_Limb': 'Running Limb',
      'Paddle_Limb': 'Paddle Limb',
      'Screw_Limb': 'Screw Limb',
      'Rolling_Hinge': 'Rolling Hinge',
      'Gear_Axle': 'Gear Axle / Wheel Roller',
      'Wheel_Roller': 'Wheel Roller',
      'Cushioning_Roller_2': 'Cushioning Roller 2',
      'Cartwheel': 'Cartwheel',
      'Airshot': 'Airshot'
    };
  }

  createPart(shape, category = 'Cores', mass = 1, customName = null) {
    if (!SHAPE_MAP[shape]) {
      console.warn(`Unknown shape: ${shape}, defaulting to Cube`);
      shape = 'Cube';
    }

    const geometry = SHAPE_MAP[shape]();
    const material = new THREE.MeshStandardMaterial({ color: 0x7db2ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 3, 1, (Math.random() - 0.5) * 3);
    this.scene.add(mesh);

    // Generate part name
    let partName = customName;
    
    if (!partName) {
      if (!this.partNameCounters[category]) {
        this.partNameCounters[category] = 0;
      }
      this.partNameCounters[category]++;
      
      const categoryNames = this.partNamingScheme[category] || [];
      if (categoryNames.length > 0) {
        const idx = (this.partNameCounters[category] - 1) % categoryNames.length;
        partName = `${categoryNames[idx]}_${this.partNameCounters[category]}`;
      } else {
        partName = `${category}_Part_${this.partNameCounters[category]}`;
      }
    }

    // Get image filename from mapping
    const imageFilename = this.partAssets[partName];
    const imageAssetPath = imageFilename ? `assets/images/${imageFilename}` : null;

    const part = {
      id: `part_${this.idCounter++}`,
      name: partName,
      mesh,
      physicsBody: this.physics.createBody(mesh, mass),
      category,
      mass,
      attachmentPoints: this._buildAttachmentPoints(),
      shape,
      lastPressure: 0,
      imageAsset: imageAssetPath,
      imageFilename: imageFilename,
      // Transform data
      transform: {
        scale: mesh.scale.clone(),
        rotation: new THREE.Euler().setFromQuaternion(mesh.quaternion)
      }
    };

    mesh.userData.partId = part.id;
    mesh.userData.partName = part.name;
    this.robot.parts.push(part);
    
    console.log(`[ROBOPTIXX] Created part: ${part.name} (${part.id}) - Image: ${imageFilename || 'None'}`);
    return part;
  }

  renamePart(partId, newName) {
    const part = this.robot.parts.find(p => p.id === partId);
    if (part) {
      const oldName = part.name;
      part.name = newName;
      part.imageAsset = this.partAssets[newName] || null;
      part.mesh.userData.partName = newName;
      console.log(`[ROBOPTIXX] Renamed: ${oldName} → ${newName}`);
    }
  }

  getPartByName(name) {
    return this.robot.parts.find(p => p.name === name);
  }

  setPartAsset(partName, imageFilename) {
    this.partAssets[partName] = imageFilename;
    const part = this.getPartByName(partName);
    if (part) {
      part.imageFilename = imageFilename;
      part.imageAsset = `assets/images/${imageFilename}`;
    }
  }

  // Auto-detect image files in assets/images/ folder
  async autoDetectImages() {
    console.log('[ROBOPTIXX] Auto-detecting image files...');
    // This will be called when assets folder is populated
    // Images will auto-load based on filename matching
  }

  removePart(partId) {
    const idx = this.robot.parts.findIndex((p) => p.id === partId);
    if (idx === -1) return;
    const part = this.robot.parts[idx];
    console.log(`[ROBOPTIXX] Removing part: ${part.name}`);
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
