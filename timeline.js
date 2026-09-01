export class TimelineSystem {
  constructor(robot) {
    this.robot = robot;
    this.isRecording = false;
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.startTime = 0;
    this.playhead = 0;
  }

  setPlaybackSpeed(speed) { this.playbackSpeed = speed; }
  startRecording() { this.isRecording = true; this.startTime = performance.now(); }
  stopRecording() { this.isRecording = false; }

  record(jointId, angle) {
    const time = (performance.now() - this.startTime) / 1000;
    this.robot.timeline.push({ time, jointId, angle });
  }

  play() {
    this.isPlaying = true;
    this.playhead = 0;
    this.startTime = performance.now();
  }

  stop() { this.isPlaying = false; }
  clear() { this.robot.timeline = []; this.isPlaying = false; this.isRecording = false; }

  step() {
    if (!this.isPlaying) return;
    this.playhead = ((performance.now() - this.startTime) / 1000) * this.playbackSpeed;
    const grouped = new Map();
    this.robot.timeline.forEach((k) => {
      if (k.time <= this.playhead) grouped.set(k.jointId, k.angle);
    });
    this.robot.joints.forEach((joint) => {
      if (!grouped.has(joint.id)) return;
      const angle = grouped.get(joint.id);
      joint.currentAngle += (angle - joint.currentAngle) * 0.25;
    });
  }
}
