export class ArduinoCodeGenerator {
  constructor(robot) { this.robot = robot; }

  generate() {
    const hinges = this.robot.joints.filter((j) => j.type === 'Hinge' && Number.isInteger(j.arduinoPin));
    const names = hinges.map((h) => `joint_${h.id.replace('joint_', '')}`);
    let ino = '#include <Servo.h>\n\n';
    names.forEach((n) => { ino += `Servo ${n};\n`; });
    ino += '\nvoid setup() {\n';
    hinges.forEach((h, i) => { ino += `  ${names[i]}.attach(${h.arduinoPin});\n`; });
    ino += '}\n\nvoid loop() {\n';
    hinges.forEach((h, i) => {
      ino += `  ${names[i]}.write(${Math.round(h.currentAngle)});\n`;
      ino += `  delay((int)(abs(${Math.round(h.currentAngle)} - ${Math.round(h.minAngle)}) / ${Math.max(1, h.speedDegPerSec)} * 1000));\n`;
    });
    ino += '}\n';
    return ino;
  }

  download(filename = 'robot_servo_program.ino') {
    const blob = new Blob([this.generate()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
