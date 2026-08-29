import { Vector3 } from './libs/three.module.js';

const DIRECTIONS_8 = [
  new Vector3(0, 0, -1), new Vector3(1, 0, -1).normalize(), new Vector3(1, 0, 0), new Vector3(1, 0, 1).normalize(),
  new Vector3(0, 0, 1), new Vector3(-1, 0, 1).normalize(), new Vector3(-1, 0, 0), new Vector3(-1, 0, -1).normalize()
];

export class SensorSystem {
  constructor(robot) {
    this.robot = robot;
    this.soundEvent = false;
  }

  simulateEnvironmentSound() { this.soundEvent = true; setTimeout(() => { this.soundEvent = false; }, 100); }

  readRGBSensor(part) {
    const y = part.mesh.position.y;
    const gray = Math.max(0, Math.min(255, 255 - y * 40));
    return { r: gray, g: gray, b: gray };
  }

  readPressureSensor(part) {
    return Number((part.lastPressure || 0).toFixed(2));
  }

  readSoundSensor() {
    return this.soundEvent ? 1 : 0;
  }

  readLaserOdometry(part, maxDistance = 8) {
    const origin = part.mesh.position;
    const distances = DIRECTIONS_8.map((dir) => {
      let nearest = maxDistance;
      this.robot.parts.forEach((other) => {
        if (other.id === part.id) return;
        const to = other.mesh.position.clone().sub(origin);
        const proj = to.x * dir.x + to.z * dir.z;
        if (proj > 0 && proj < nearest) nearest = proj;
      });
      return Number(nearest.toFixed(2));
    });
    return distances;
  }
}
