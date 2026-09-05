import { PART_CATEGORIES } from './parts.js';
import { TransformSystem } from './transform.js';

export class UISystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.dom = this._collectDom();
    this.selectedJoint = null;
    this.selectedPart = null;
    this.transformSystem = new TransformSystem(ctx.sceneSystem.scene, this);
    this._populateParts();
    this._bind();
    this._bindTransformControls();
  }

  _collectDom() {
    return {
      category: document.getElementById('part-category'),
      partButtons: document.getElementById('part-buttons'),
      newBtn: document.getElementById('new-project'),
      saveBtn: document.getElementById('save-project'),
      loadInput: document.getElementById('load-project'),
      simulateBtn: document.getElementById('toggle-simulate'),
      exportBtn: document.getElementById('export-arduino'),
      createHinge: document.getElementById('create-hinge'),
      delSel: document.getElementById('delete-selected'),
      minimapToggle: document.getElementById('toggle-minimap'),
      gravityToggle: document.getElementById('toggle-gravity'),
      record: document.getElementById('timeline-record'),
      play: document.getElementById('timeline-play'),
      stop: document.getElementById('timeline-stop'),
      clear: document.getElementById('timeline-clear'),
      speed: document.getElementById('timeline-speed'),
      status: document.getElementById('timeline-status'),
      inspectorEmpty: document.getElementById('inspector-empty'),
      fields: document.getElementById('inspector-fields'),
      partName: document.getElementById('ins-part-name'),
      partId: document.getElementById('ins-part-id'),
      partCategory: document.getElementById('ins-part-category'),
      partImagePreview: document.getElementById('ins-part-image'),
      mass: document.getElementById('ins-mass'),
      // Transform controls
      scaleX: document.getElementById('scale-x'),
      scaleY: document.getElementById('scale-y'),
      scaleZ: document.getElementById('scale-z'),
      scaleUpBtn: document.getElementById('scale-up-btn'),
      scaleDownBtn: document.getElementById('scale-down-btn'),
      rotateX: document.getElementById('rotate-x'),
      rotateY: document.getElementById('rotate-y'),
      rotateZ: document.getElementById('rotate-z'),
      rotXBtn: document.getElementById('rot-x-btn'),
      rotYBtn: document.getElementById('rot-y-btn'),
      rotZBtn: document.getElementById('rot-z-btn'),
      resetTransformBtn: document.getElementById('reset-transform-btn'),
      // Joint controls
      minA: document.getElementById('ins-min-angle'),
      maxA: document.getElementById('ins-max-angle'),
      servoSpeed: document.getElementById('ins-speed'),
      pin: document.getElementById('ins-pin'),
      motor: document.getElementById('ins-motor')
    };
  }

  _populateParts() {
    PART_CATEGORIES.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      this.dom.category.appendChild(opt);
    });

    ['Cube', 'Cylinder', 'Sphere', 'Capsule', 'Plate'].forEach((shape) => {
      const b = document.createElement('button');
      b.textContent = `+ ${shape}`;
      b.addEventListener('click', () => {
        this.ctx.partsSystem.createPart(shape, this.dom.category.value);
      });
      this.dom.partButtons.appendChild(b);
    });
  }

  _bind() {
    this.dom.newBtn.addEventListener('click', () => this.ctx.projectManager.resetScene());

    this.dom.saveBtn.addEventListener('click', async () => {
      const projectName = prompt('Project name:', this.ctx.projectManager.currentProjectName || 'My Robot');
      if (projectName) {
        await this.ctx.projectManager.saveProject(projectName);
        alert(`Project "${projectName}" saved!`);
      }
    });

    this.dom.loadInput.addEventListener('change', async (e) => {
      if (e.target.files[0]) {
        await this.ctx.projectManager.importProjectJSON(e.target.files[0]);
      }
      e.target.value = '';
    });

    this.dom.simulateBtn.addEventListener('click', () => {
      this.ctx.toggleMode();
      this.dom.simulateBtn.textContent = this.ctx.robot.mode === 'simulate' ? 'Stop Simulate' : 'Simulate';
    });

    this.dom.exportBtn.addEventListener('click', () => {
      this.ctx.projectManager.exportArduino();
    });

    this.dom.createHinge.addEventListener('click', () => this._createHinge());

    this.dom.delSel.addEventListener('click', () => {
      this.ctx.sceneSystem.selected.forEach((s) => {
        this.ctx.partsSystem.removePart(s.id);
      });
      this.ctx.sceneSystem.clearSelection();
    });

    this.dom.minimapToggle.addEventListener('change', (e) => {
      this.ctx.minimapSystem.setVisible(e.target.checked);
    });

    this.dom.gravityToggle.addEventListener('change', (e) => {
      this.ctx.physicsSystem.setGravityEnabled(e.target.checked);
    });

    this.dom.record.addEventListener('click', () => {
      this.ctx.timelineSystem.startRecording();
      this.dom.status.textContent = 'Timeline: Recording ⏺';
      this.dom.record.style.opacity = '0.5';
    });

    this.dom.play.addEventListener('click', () => {
      this.ctx.timelineSystem.play();
      this.dom.status.textContent = 'Timeline: Playing ▶';
      this.dom.record.style.opacity = '1';
    });

    this.dom.stop.addEventListener('click', () => {
      this.ctx.timelineSystem.stop();
      this.ctx.timelineSystem.stopRecording();
      this.dom.status.textContent = 'Timeline: Stopped ⏹';
      this.dom.record.style.opacity = '1';
    });

    this.dom.clear.addEventListener('click', () => {
      this.ctx.timelineSystem.clear();
      this.dom.status.textContent = 'Timeline: Cleared ✓';
    });

    this.dom.speed.addEventListener('input', (e) => {
      this.ctx.timelineSystem.setPlaybackSpeed(Number(e.target.value));
    });

    [this.dom.mass, this.dom.minA, this.dom.maxA, this.dom.servoSpeed, this.dom.pin, this.dom.motor].forEach((el) => {
      el.addEventListener('input', () => this.applyInspector());
    });
  }

  _createHinge() {
    const sel = this.ctx.sceneSystem.selected;
    if (sel.length < 2) {
      alert('Select 2 parts to create a hinge');
      return;
    }
    const joint = this.ctx.jointSystem.createJoint('Hinge', sel[0], sel[1]);
    this.inspectJoint(joint);
  }

  inspectPart(part) {
    this.selectedJoint = null;
    this.selectedPart = part;
    this.transformSystem.selectPart(part);
    this.dom.inspectorEmpty.classList.add('hidden');
    this.dom.fields.classList.remove('hidden');
    
    // Part details
    this.dom.partName.value = part.name;
    this.dom.partId.value = part.id;
    this.dom.partCategory.value = part.category;
    
    // Image preview
    if (part.imageAsset) {
      this.dom.partImagePreview.innerHTML = `<img src="${part.imageAsset}" style="width: 100%; height: 100%; object-fit: contain;" />`;
    } else {
      this.dom.partImagePreview.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No image</div>`;
    }
    
    this.dom.mass.value = part.mass;
    
    // Update transform display
    this.updateTransformDisplay(part);
    
    this.dom.minA.value = '';
    this.dom.maxA.value = '';
    this.dom.servoSpeed.value = '';
    this.dom.pin.value = '';
    this.dom.motor.checked = false;
  }

  inspectJoint(joint) {
    this.selectedJoint = joint;
    this.dom.inspectorEmpty.classList.add('hidden');
    this.dom.fields.classList.remove('hidden');
    this.dom.mass.value = '';
    this.dom.minA.value = joint.minAngle;
    this.dom.maxA.value = joint.maxAngle;
    this.dom.servoSpeed.value = joint.speedDegPerSec;
    this.dom.pin.value = joint.arduinoPin ?? '';
    this.dom.motor.checked = joint.motorEnabled;
  }

  applyInspector() {
    // Update part name
    if (this.selectedPart && this.dom.partName.value !== '') {
      const newName = this.dom.partName.value;
      this.ctx.partsSystem.renamePart(this.selectedPart.id, newName);
      this.selectedPart.name = newName;
    }

    const selectedPart = this.ctx.sceneSystem.selected[0];
    if (selectedPart && this.dom.mass.value !== '') {
      selectedPart.mass = Number(this.dom.mass.value);
      if (selectedPart.physicsBody) {
        selectedPart.physicsBody.mass = selectedPart.mass;
      }
    }

    if (this.selectedJoint) {
      this.selectedJoint.minAngle = Number(this.dom.minA.value) || -90;
      this.selectedJoint.maxAngle = Number(this.dom.maxA.value) || 90;
      this.selectedJoint.speedDegPerSec = Number(this.dom.servoSpeed.value || 60);
      this.selectedJoint.arduinoPin = this.dom.pin.value === '' ? null : Number(this.dom.pin.value);
      this.selectedJoint.motorEnabled = this.dom.motor.checked;
    }
  }

  _bindTransformControls() {
    // Scale controls
    this.dom.scaleUpBtn.addEventListener('click', () => {
      this.transformSystem.scalePart('xyz', 1.1);
    });

    this.dom.scaleDownBtn.addEventListener('click', () => {
      this.transformSystem.scalePart('xyz', 0.9);
    });

    this.dom.scaleX.addEventListener('change', (e) => {
      this.transformSystem.setScale('x', Number(e.target.value));
    });

    this.dom.scaleY.addEventListener('change', (e) => {
      this.transformSystem.setScale('y', Number(e.target.value));
    });

    this.dom.scaleZ.addEventListener('change', (e) => {
      this.transformSystem.setScale('z', Number(e.target.value));
    });

    // Rotation controls
    this.dom.rotXBtn.addEventListener('click', () => {
      const angle = Number(this.dom.rotateX.value) || 15;
      this.transformSystem.rotatePart('x', angle);
    });

    this.dom.rotYBtn.addEventListener('click', () => {
      const angle = Number(this.dom.rotateY.value) || 15;
      this.transformSystem.rotatePart('y', angle);
    });

    this.dom.rotZBtn.addEventListener('click', () => {
      const angle = Number(this.dom.rotateZ.value) || 15;
      this.transformSystem.rotatePart('z', angle);
    });

    this.dom.rotateX.addEventListener('change', (e) => {
      this.transformSystem.setRotation('x', Number(e.target.value));
    });

    this.dom.rotateY.addEventListener('change', (e) => {
      this.transformSystem.setRotation('y', Number(e.target.value));
    });

    this.dom.rotateZ.addEventListener('change', (e) => {
      this.transformSystem.setRotation('z', Number(e.target.value));
    });

    // Reset
    this.dom.resetTransformBtn.addEventListener('click', () => {
      this.transformSystem.resetTransform();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.transformSystem.handleKeyboard(e);
    });
  }

  updateTransformDisplay(part) {
    const values = this.transformSystem.getTransformValues();
    if (values) {
      this.dom.scaleX.value = values.scaleX;
      this.dom.scaleY.value = values.scaleY;
      this.dom.scaleZ.value = values.scaleZ;
      this.dom.rotateX.value = values.rotX;
      this.dom.rotateY.value = values.rotY;
      this.dom.rotateZ.value = values.rotZ;
    }
  }
}
