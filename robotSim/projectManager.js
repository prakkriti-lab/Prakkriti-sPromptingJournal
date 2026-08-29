export class ProjectManager {
  constructor(robot, partsSystem, jointSystem, codeGenerator) {
    this.robot = robot;
    this.partsSystem = partsSystem;
    this.jointSystem = jointSystem;
    this.codeGenerator = codeGenerator;
  }

  saveProject() {
    const payload = {
      mode: this.robot.mode,
      parts: this.robot.parts.map((p) => ({
        id: p.id, category: p.category, mass: p.mass, shape: p.shape,
        position: { x: p.mesh.position.x, y: p.mesh.position.y, z: p.mesh.position.z }
      })),
      joints: this.robot.joints,
      sensors: this.robot.sensors,
      timeline: this.robot.timeline
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'robot_project.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async loadProject(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    this.resetScene();
    const created = new Map();
    data.parts.forEach((pd) => {
      const p = this.partsSystem.createPart(pd.shape, pd.category, pd.mass);
      p.mesh.position.set(pd.position.x, pd.position.y, pd.position.z);
      created.set(pd.id, p);
    });
    data.joints.forEach((j) => {
      this.jointSystem.createJoint(j.type, created.get(j.partA), created.get(j.partB), j);
    });
    this.robot.timeline = data.timeline || [];
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
}
