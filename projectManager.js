import { THREE } from './cloud-imports.js';
import { saveProject, loadProject, listProjects, exportProjectJSON, importProjectJSON } from './storage.js';

export class ProjectManager {
  constructor(robot, partsSystem, jointSystem, codeGenerator) {
    this.robot = robot;
    this.partsSystem = partsSystem;
    this.jointSystem = jointSystem;
    this.codeGenerator = codeGenerator;
    this.currentProjectName = null;
  }

  _serializeProject() {
    return {
      mode: this.robot.mode,
      parts: this.robot.parts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        mass: p.mass,
        shape: p.shape,
        imageFilename: p.imageFilename,
        imageAsset: p.imageAsset,
        position: { x: p.mesh.position.x, y: p.mesh.position.y, z: p.mesh.position.z },
        // Transform data
        transform: {
          scale: { x: p.mesh.scale.x, y: p.mesh.scale.y, z: p.mesh.scale.z },
          rotation: p.transform ? {
            x: p.transform.rotation?.x || 0,
            y: p.transform.rotation?.y || 0,
            z: p.transform.rotation?.z || 0
          } : { x: 0, y: 0, z: 0 }
        }
      })),
      joints: this.robot.joints,
      sensors: this.robot.sensors,
      timeline: this.robot.timeline
    };
  }

  async saveProject(projectName) {
    try {
      const payload = this._serializeProject();
      await saveProject(projectName, payload);
      this.currentProjectName = projectName;
      console.log(`[ROBOPTIXX] Project "${projectName}" saved to IndexedDB`);
      return true;
    } catch (error) {
      console.error('[ROBOPTIXX] Failed to save project:', error);
      alert('Failed to save project: ' + error.message);
      return false;
    }
  }

  async loadProject(projectName) {
    try {
      const data = await loadProject(projectName);
      this.resetScene();
      const created = new Map();
      
      data.parts.forEach((pd) => {
        const p = this.partsSystem.createPart(pd.shape, pd.category, pd.mass, pd.name);
        p.mesh.position.set(pd.position.x, pd.position.y, pd.position.z);
        
        // Restore transform data
        if (pd.transform) {
          if (pd.transform.scale) {
            p.mesh.scale.set(pd.transform.scale.x, pd.transform.scale.y, pd.transform.scale.z);
          }
          if (pd.transform.rotation) {
            const euler = new THREE.Euler(pd.transform.rotation.x, pd.transform.rotation.y, pd.transform.rotation.z);
            p.mesh.quaternion.setFromEuler(euler);
            p.transform.rotation = euler;
          }
        }
        
        if (pd.imageFilename) {
          p.imageFilename = pd.imageFilename;
          p.imageAsset = `assets/images/${pd.imageFilename}`;
          this.partsSystem.setPartAsset(pd.name, pd.imageFilename);
        }
        created.set(pd.id, p);
      });
      
      data.joints.forEach((j) => {
        if (created.has(j.partA) && created.has(j.partB)) {
          this.jointSystem.createJoint(j.type, created.get(j.partA), created.get(j.partB), j);
        }
      });
      
      this.robot.timeline = data.timeline || [];
      this.robot.sensors = data.sensors || [];
      this.currentProjectName = projectName;
      
      console.log(`[ROBOPTIXX] Project "${projectName}" loaded from IndexedDB`);
      return true;
    } catch (error) {
      console.error('[ROBOPTIXX] Failed to load project:', error);
      alert('Failed to load project: ' + error.message);
      return false;
    }
  }

  async listProjects() {
    try {
      return await listProjects();
    } catch (error) {
      console.error('[ROBOPTIXX] Failed to list projects:', error);
      return [];
    }
  }

  resetScene() {
    [...this.robot.parts].forEach((p) => this.partsSystem.removePart(p.id));
    this.robot.joints = [];
    this.robot.timeline = [];
    this.robot.sensors = [];
    this.robot.mode = 'edit';
  }

  exportArduino() {
    this.codeGenerator.download();
  }

  exportProjectJSON() {
    const payload = this._serializeProject();
    const json = exportProjectJSON(payload);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `robot_project_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async importProjectJSON(file) {
    try {
      const text = await file.text();
      const data = importProjectJSON(text);
      
      this.resetScene();
      const created = new Map();
      
      data.parts.forEach((pd) => {
        const p = this.partsSystem.createPart(pd.shape, pd.category, pd.mass);
        p.mesh.position.set(pd.position.x, pd.position.y, pd.position.z);
        created.set(pd.id, p);
      });
      
      data.joints.forEach((j) => {
        if (created.has(j.partA) && created.has(j.partB)) {
          this.jointSystem.createJoint(j.type, created.get(j.partA), created.get(j.partB), j);
        }
      });
      
      this.robot.timeline = data.timeline || [];
      this.robot.sensors = data.sensors || [];
      
      console.log('[ROBOPTIXX] Project imported from JSON');
      return true;
    } catch (error) {
      console.error('[ROBOPTIXX] Failed to import project:', error);
      alert('Failed to import project: ' + error.message);
      return false;
    }
  }
}
