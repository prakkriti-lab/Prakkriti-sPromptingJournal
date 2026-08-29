export class JointSystem {
  constructor(robot) {
    this.robot = robot;
    this.idCounter = 1;
  }

  createJoint(type, partA, partB, options = {}) {
    const joint = {
      id: `joint_${this.idCounter++}`,
      type,
      partA: partA.id,
      partB: partB.id,
      minAngle: options.minAngle ?? -90,
      maxAngle: options.maxAngle ?? 90,
      currentAngle: options.currentAngle ?? 0,
      speedDegPerSec: options.speedDegPerSec ?? 60,
      arduinoPin: options.arduinoPin ?? null,
      motorEnabled: options.motorEnabled ?? false,
      sliderLimit: options.sliderLimit ?? 1
    };
    this.robot.joints.push(joint);
    return joint;
  }

  getHinges() {
    return this.robot.joints.filter((j) => j.type === 'Hinge');
  }
}
