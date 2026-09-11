import { THREE } from './cloud-imports.js';

let SHAPE_MAP = null;

function getShapeMap() {
  if (!SHAPE_MAP) {
    // THREE is now available from window (loaded via script tag)
    SHAPE_MAP = {
      Cube: () => new THREE.BoxGeometry(1, 1, 1),
      Cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1),
      Sphere: () => new THREE.SphereGeometry(0.5),
      Capsule: () => new THREE.CapsuleGeometry(0.35, 0.8),
      Plate: () => new THREE.BoxGeometry(1.4, 0.2, 1.4)
    };
  }
  return SHAPE_MAP;
}

export const PART_CATEGORIES = ['Limbs', 'Connectors', 'Levers', 'Joints', 'Cushioning'];

export class PartsSystem {
  constructor(scene, physics, robot) {
    this.scene = scene;
    this.physics = physics;
    this.robot = robot;
    this.idCounter = 1;
    
    // Custom Robot Part Naming Scheme - UPDATED TO ACTUAL FOLDERS
    this.partNamingScheme = {
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
      'Connectors': [
        'Anchor_Hook',
        'Spade'
      ],
      'Levers': [
        'Lever_1',
        'Lever_2'
      ],
      'Joints': [
        'Rolling_Hinge',
        'Gear_Axle',
        'Wheel_Roller'
      ],
      'Cushioning': [
        'Cushioning_Roller_2'
      ]
    };
    
    this.partNameCounters = {};
    
    // IMAGE FILENAME MAPPING - ACTUAL USER IMAGES
    this.partAssets = {
      // Limbs folder
      'Lifting_Limb': 'Lifting Limb',
      'Running_Limb': 'Running Limb',
      'Hilly_Region_Limb': 'Sandy/Hilly Region Limb',
      'Crew_Limb': 'Crew Limb',
      'Spider_Limb': 'Spider Limb',
      'Clawed_Limb': 'Clawed Limb',
      'Paddle_Limb': 'Paddle Limb',
      'Screw_Limb': 'Screw Limb',
      
      // Connectors folder
      'Anchor_Hook': 'Anchor Hook',
      'Spade': 'Spade',
      
      // Levers folder (user will add images)
      'Lever_1': 'Lever_1',
      'Lever_2': 'Lever_2',
      
      // Joints folder
      'Rolling_Hinge': 'Rolling Hinge',
      'Gear_Axle': 'Gear Axle / Wheel Roller',
      'Wheel_Roller': 'Wheel Roller',
      
      // Cushioning folder
      'Cushioning_Roller_2': 'Cushioning Roller 2'
    };
  }

  createPart(shape, category = 'Limbs', mass = 1, customName = null) {
    const shapeMap = getShapeMap();
    if (!shapeMap[shape]) {
      console.warn(`Unknown shape: ${shape}, defaulting to Cube`);
      shape = 'Cube';
    }

    const geometry = shapeMap[shape]();
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

    // Get image filename from mapping and construct folder path
    const imageFilename = this.partAssets[partName];
    
    // Determine folder based on category
    const folderMap = {
      'Limbs': 'limbs',
      'Connectors': 'connectors',
      'Levers': 'levers',
      'Joints': 'joints',
      'Cushioning': 'cushioning'
    };
    
    const folder = folderMap[category] || category.toLowerCase();
    const imageAssetPath = imageFilename ? `assets/images/${folder}/${imageFilename}` : null;

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
    
    console.log(`[ROBOPTIXX] Created part: ${part.name} (${part.id}) - Image: ${imageFilename || 'None'} - Path: ${imageAssetPath || 'None'}`);
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
