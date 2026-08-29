const degToRad = (d) => (d * Math.PI) / 180;

export class ServoSystem {
  constructor(robot, timelineSystem) {
    this.robot = robot;
    this.timelineSystem = timelineSystem;
    this.targets = new Map();
  }

  setTarget(jointId, angleDeg) {
    this.targets.set(jointId, angleDeg);
  }

  step(deltaSeconds) {
    for (const joint of this.robot.joints) {
      if (joint.type !== 'Hinge' || !joint.motorEnabled) continue;
      const target = this.targets.get(joint.id) ?? joint.currentAngle;
      const clampedTarget = Math.max(joint.minAngle, Math.min(joint.maxAngle, target));
      const diff = clampedTarget - joint.currentAngle;
      const maxMove = joint.speedDegPerSec * deltaSeconds;
      const step = Math.abs(diff) <= maxMove ? diff : Math.sign(diff) * maxMove;
      joint.currentAngle += step;
      joint.currentAngleRad = degToRad(joint.currentAngle);
      if (this.timelineSystem.isRecording) {
        this.timelineSystem.record(joint.id, joint.currentAngle);
      }
    }
  }
}
