import { THREE } from './cloud-imports.js';

export class TransformSystem {
  constructor(scene, ui) {
    this.scene = scene;
    this.ui = ui;
    this.selectedPart = null;
    this.transformMode = 'translate'; // translate, scale, rotate
    this.rotationMode = 'x'; // x, y, z
    this.gizmos = {
      translate: null,
      scale: null,
      rotate: null
    };
    this.originalTransform = null;
  }

  selectPart(part) {
    this.selectedPart = part;
    this.originalTransform = {
      position: part.mesh.position.clone(),
      scale: part.mesh.scale.clone(),
      rotation: new THREE.Euler().setFromQuaternion(part.mesh.quaternion)
    };
    console.log('[ROBOPTIXX] Transform: Part selected -', part.name);
  }

  deselectPart() {
    this.selectedPart = null;
    this.originalTransform = null;
  }

  // SCALE (RESIZE)
  scalePart(axis, factor) {
    if (!this.selectedPart) return;
    const part = this.selectedPart;

    if (axis === 'xyz') {
      // Uniform scale
      part.mesh.scale.x *= factor;
      part.mesh.scale.y *= factor;
      part.mesh.scale.z *= factor;
      console.log(`[ROBOPTIXX] Scaled ${part.name} uniformly: ${factor.toFixed(2)}x`);
    } else if (axis === 'x') {
      part.mesh.scale.x *= factor;
    } else if (axis === 'y') {
      part.mesh.scale.y *= factor;
    } else if (axis === 'z') {
      part.mesh.scale.z *= factor;
    }

    // Update physics if exists
    if (part.physicsBody) {
      part.physicsBody.getShapeList()[0].setLocalScaling(new Ammo.btVector3(
        part.mesh.scale.x,
        part.mesh.scale.y,
        part.mesh.scale.z
      ));
    }

    // Store transform
    part.transform = part.transform || {};
    part.transform.scale = part.mesh.scale.clone();

    this.ui.updateTransformDisplay(part);
  }

  // Set specific scale value
  setScale(axis, value) {
    if (!this.selectedPart) return;
    const part = this.selectedPart;

    if (axis === 'xyz') {
      part.mesh.scale.set(value, value, value);
    } else if (axis === 'x') {
      part.mesh.scale.x = value;
    } else if (axis === 'y') {
      part.mesh.scale.y = value;
    } else if (axis === 'z') {
      part.mesh.scale.z = value;
    }

    // Update physics
    if (part.physicsBody) {
      part.physicsBody.getShapeList()[0].setLocalScaling(new Ammo.btVector3(
        part.mesh.scale.x,
        part.mesh.scale.y,
        part.mesh.scale.z
      ));
    }

    part.transform = part.transform || {};
    part.transform.scale = part.mesh.scale.clone();

    this.ui.updateTransformDisplay(part);
  }

  // ROTATE
  rotatePart(axis, angleDegrees) {
    if (!this.selectedPart) return;
    const part = this.selectedPart;
    const angleRad = THREE.MathUtils.degToRad(angleDegrees);

    if (axis === 'x') {
      part.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), angleRad);
    } else if (axis === 'y') {
      part.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angleRad);
    } else if (axis === 'z') {
      part.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), angleRad);
    }

    // Store transform
    part.transform = part.transform || {};
    part.transform.rotation = new THREE.Euler().setFromQuaternion(part.mesh.quaternion);

    console.log(`[ROBOPTIXX] Rotated ${part.name} around ${axis}: ${angleDegrees}°`);
    this.ui.updateTransformDisplay(part);
  }

  // Set absolute rotation
  setRotation(axis, angleDegrees) {
    if (!this.selectedPart) return;
    const part = this.selectedPart;

    let euler = new THREE.Euler().setFromQuaternion(part.mesh.quaternion);

    if (axis === 'x') {
      euler.x = THREE.MathUtils.degToRad(angleDegrees);
    } else if (axis === 'y') {
      euler.y = THREE.MathUtils.degToRad(angleDegrees);
    } else if (axis === 'z') {
      euler.z = THREE.MathUtils.degToRad(angleDegrees);
    }

    part.mesh.quaternion.setFromEuler(euler);

    part.transform = part.transform || {};
    part.transform.rotation = euler;

    this.ui.updateTransformDisplay(part);
  }

  // Get current transform values
  getTransformValues() {
    if (!this.selectedPart) return null;
    const part = this.selectedPart;

    const euler = new THREE.Euler().setFromQuaternion(part.mesh.quaternion);

    return {
      scaleX: part.mesh.scale.x.toFixed(3),
      scaleY: part.mesh.scale.y.toFixed(3),
      scaleZ: part.mesh.scale.z.toFixed(3),
      rotX: THREE.MathUtils.radToDeg(euler.x).toFixed(1),
      rotY: THREE.MathUtils.radToDeg(euler.y).toFixed(1),
      rotZ: THREE.MathUtils.radToDeg(euler.z).toFixed(1)
    };
  }

  // Reset to original
  resetTransform() {
    if (!this.selectedPart || !this.originalTransform) return;
    const part = this.selectedPart;

    part.mesh.position.copy(this.originalTransform.position);
    part.mesh.scale.copy(this.originalTransform.scale);
    part.mesh.quaternion.setFromEuler(this.originalTransform.rotation);

    part.transform = {
      scale: part.mesh.scale.clone(),
      rotation: new THREE.Euler().setFromQuaternion(part.mesh.quaternion)
    };

    console.log('[ROBOPTIXX] Transform reset for:', part.name);
    this.ui.updateTransformDisplay(part);
  }

  // Keyboard shortcuts
  handleKeyboard(event) {
    if (!this.selectedPart) return;

    const step = event.shiftKey ? 0.1 : 0.05; // Small steps
    const rotStep = event.shiftKey ? 15 : 5;   // Rotation steps

    switch (event.key.toUpperCase()) {
      case 'E': // Scale up
        this.scalePart('xyz', 1 + step);
        event.preventDefault();
        break;
      case 'Q': // Scale down
        this.scalePart('xyz', 1 - step);
        event.preventDefault();
        break;
      case 'R': // Rotate around X
        this.rotatePart('x', rotStep);
        event.preventDefault();
        break;
      case 'T': // Rotate around Y
        this.rotatePart('y', rotStep);
        event.preventDefault();
        break;
      case 'Y': // Rotate around Z
        this.rotatePart('z', rotStep);
        event.preventDefault();
        break;
      case 'Z': // Reset transform
        this.resetTransform();
        event.preventDefault();
        break;
    }
  }
}
