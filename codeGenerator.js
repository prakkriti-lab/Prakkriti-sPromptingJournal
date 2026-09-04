export class ArduinoCodeGenerator {
  constructor(robot) { 
    this.robot = robot; 
  }

  generate() {
    let code = `// ROBOPTIXX Auto-Generated Robot Controller\n`;
    code += `// Generated: ${new Date().toLocaleString()}\n`;
    code += `// Robot Configuration\n\n`;
    code += `#include <Servo.h>\n\n`;

    code += `// ========== ROBOT STRUCTURE ==========\n`;
    code += `// Total Parts: ${this.robot.parts.length}\n`;
    code += `// Total Joints: ${this.robot.joints.length}\n\n`;

    code += `// ========== PART DECLARATIONS ==========\n`;
    this.robot.parts.forEach((part) => {
      code += `// ${part.name} (Category: ${part.category}, Mass: ${part.mass}kg)\n`;
    });

    code += `\n// ========== JOINT DECLARATIONS ==========\n`;
    this.robot.joints.forEach((j, idx) => {
      const partA = this.robot.parts.find(p => p.id === j.partA);
      const partB = this.robot.parts.find(p => p.id === j.partB);
      code += `Servo servo_${idx}; // ${partA ? partA.name : 'PartA'} <-> ${partB ? partB.name : 'PartB'}\n`;
    });

    code += `\n// ========== CONFIGURATION ==========\n`;
    this.robot.joints.forEach((j, idx) => {
      code += `const int PIN_${idx} = ${j.arduinoPin || 9};\n`;
      code += `const int MIN_${idx} = ${j.minAngle || -90};\n`;
      code += `const int MAX_${idx} = ${j.maxAngle || 90};\n`;
      code += `const int SPEED_${idx} = ${j.speedDegPerSec || 60};\n\n`;
    });

    code += `// ========== SETUP ==========\n`;
    code += `void setup() {\n`;
    code += `  Serial.begin(9600);\n`;
    code += `  Serial.println("ROBOPTIXX Robot Initialized");\n`;
    code += `  Serial.print("Parts: "); Serial.println(${this.robot.parts.length});\n`;
    code += `  Serial.print("Joints: "); Serial.println(${this.robot.joints.length});\n\n`;

    this.robot.joints.forEach((j, idx) => {
      const partA = this.robot.parts.find(p => p.id === j.partA);
      code += `  servo_${idx}.attach(PIN_${idx}); // ${partA ? partA.name : 'Joint ' + idx}\n`;
    });

    code += `}\n\n`;

    code += `// ========== MAIN LOOP ==========\n`;
    code += `void loop() {\n`;
    code += `  // Control logic for robot movement\n`;
    code += `  // Available joints:\n`;
    
    this.robot.joints.forEach((j, idx) => {
      const partA = this.robot.parts.find(p => p.id === j.partA);
      code += `  // servo_${idx}.write(angle); // ${partA ? partA.name : 'Joint ' + idx}\n`;
    });

    code += `  delay(50);\n`;
    code += `}\n`;

    return code;
  }

  download(filename = `robot_${Date.now()}.ino`) {
    const blob = new Blob([this.generate()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
