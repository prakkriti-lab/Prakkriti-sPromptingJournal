import { THREE } from './cloud-imports.js';

const DIRECTIONS_8 = [
  new THREE.Vector3(0, 0, -1),
  new THREE.Vector3(1, 0, -1).normalize(),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(1, 0, 1).normalize(),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(-1, 0, 1).normalize(),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(-1, 0, -1).normalize()
];

export class SensorSystem {
  constructor(robot) {
    this.robot = robot;
    this.soundEvent = false;
  }

  simulateEnvironmentSound() {
    this.soundEvent = true;
    setTimeout(() => { this.soundEvent = false; }, 100);
  }

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

  // Environmental effect simulants
  getHeatEffect(part) {
    // Simulate temperature effect on sensors
    // Returns temp in Celsius
    return 25 + Math.random() * 10;
  }

  getWindEffect(part) {
    // Simulate wind force vector
    return new THREE.Vector3(
      Math.sin(Date.now() / 1000) * 0.5,
      0,
      Math.cos(Date.now() / 1000) * 0.5
    );
  }

  getDustAccumulation(part) {
    // Simulate dust accumulation over time
    // Returns value 0-1 (affects sensor accuracy)
    return Math.min(1, (Date.now() / 60000) * 0.01);
  }

  getHumidityEffect(part) {
    // Simulate humidity/water contact effect on electronics
    // Returns 0-1 where 1 is fully saturated
    const noise = Math.sin(Date.now() / 5000) * 0.5 + 0.5;
    return Math.min(1, part.mesh.position.y < 0 ? 1 : noise);
  }

  getSensorIncompatibility(sensor1, sensor2) {
    // Check if two sensors have incompatible specifications
    const incompatibilities = {
      'pressure+accelerometer': 0.3,
      'rgb+infrared': 0.2,
      'ultrasonic+sonar': 0.4
    };
    const key = [sensor1, sensor2].sort().join('+');
    return incompatibilities[key] || 0;
  }
}
