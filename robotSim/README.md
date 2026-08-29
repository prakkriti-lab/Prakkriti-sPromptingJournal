# RobotSim IDE - Cloud Edition

A fully refactored cloud-based robot simulator IDE for building, simulating, and programming robots.

## 🚀 Features

- **Drag-and-Drop Robot Assembly** - Build robots by dragging parts onto a canvas
- **Rigging & Joint System** - Create mechanical joints between parts with configurable angles and speeds
- **Physics Simulation** - Real-time physics using Ammo.js WASM
- **Sensor Simulation** - RGB, pressure, laser odometry, and environmental effects (heat, wind, dust, humidity)
- **PCB Wiring & Arduino Code Generation** - Assign servo motors to Arduino pins and export C++ code
- **Timeline Recording/Playback** - Record and playback robot movements
- **Cloud-Based** - No local file dependencies; uses IndexedDB for project storage
- **CDN-Powered** - All dependencies loaded from CDN (Three.js, Ammo.js)

## 📦 Architecture

### New Cloud Files

- **`cloud-imports.js`** - Unified CDN import handler for Three.js and Ammo.js WASM
- **`storage.js`** - IndexedDB project persistence layer
- **`main.js`** - Application initialization and bootstrap (refactored with async/await)

### Updated Modules

- **`scene.js`** - Three.js scene with async control loading
- **`parts.js`** - Robot part creation from CDN THREE
- **`physics.js`** - Ammo.js physics engine (proper WASM initialization)
- **`sensors.js`** - Enhanced with environmental simulants
- **`projectManager.js`** - IndexedDB + JSON export/import
- **`ui.js`** - Async project save/load operations
- **`index.html`** - Loading screen + CDN bootstrap

### Removed

- `libs/` folder (all local dependencies removed)
- File-based project storage (replaced with IndexedDB)

## 🌐 Cloud Deployment

This version is designed for cloud compilers and web-based IDEs:

✅ **No local file system dependencies**
✅ **All imports from CDN** (jsDelivr)
✅ **Browser storage via IndexedDB** (no server required)
✅ **Works in any modern browser** (Chrome, Firefox, Safari, Edge)
✅ **Compatible with cloud platforms**:
- Replit
- CodePen
- JSFiddle
- StackBlitz
- Vercel/Netlify

## 🎮 How to Run

### Option 1: Local HTTP Server

```bash
# Navigate to robotSim directory
cd robotSim

# Use Python 3
python -m http.server 8000

# Or use Node.js http-server
npx http-server

# Open http://localhost:8000
```

### Option 2: Cloud Platforms

1. Upload all files to Replit, CodePen, or similar
2. Set index.html as the entry point
3. Run and access via the platform's preview

## 🏗️ Building a Robot

1. **Add Parts** - Click `+ Cube`, `+ Cylinder`, etc. from the left panel
2. **Select Parts** - Click on parts in the viewport to select (yellow highlight)
3. **Create Joints** - Select 2 parts, click "Create Hinge (2x)" to link them
4. **Configure** - Use the right inspector panel to set:
   - Mass
   - Joint angle limits
   - Servo motor speed
   - Arduino pin assignment
5. **Simulate** - Click "Simulate" to enable physics and test movement
6. **Export** - Click "Export Arduino" to generate C++ code

## 📊 Sensor Simulation

The simulator includes:
- **Laser Odometry** - 8-directional distance sensing
- **Pressure Sensor** - Collision/weight detection
- **RGB Sensor** - Position-based color reading
- **Sound Sensor** - Environmental noise events
- **Environmental Effects**:
  - 🌡️ Heat/Temperature
  - 💨 Wind Force
  - 🌪️ Dust Accumulation
  - 💧 Humidity/Water Contact
  - ⚠️ Sensor Incompatibility Mapping

## 💾 Project Storage

Projects are stored in **IndexedDB** (browser storage):
- **Save** - Saves to IndexedDB automatically
- **Import/Export JSON** - Download project as `.json` file for backup/sharing

## 🔧 Technical Stack

| Component | Source | Version |
|-----------|--------|---------|
| Three.js | CDN (jsDelivr) | r128 |
| Ammo.js (Physics) | CDN (jsDelivr) | 0.0.9 |
| Storage | Browser IndexedDB | Native |
| Runtime | Browser ES Modules | Native |

## 🐛 Known Limitations

- Physics is approximate (simplified box shapes for all geometries)
- Ammo.js WASM may take a few seconds to load on first run
- Maximum part count ~200-300 for smooth 60fps simulation
- IndexedDB storage limit varies by browser (usually 50MB+)

## 📝 File Structure

```
robotSim/
├── index.html              # HTML entry point + loading UI
├── main.js                 # App initialization
├── cloud-imports.js        # CDN import handler
├── storage.js              # IndexedDB persistence
├── scene.js                # Three.js scene management
├── physics.js              # Ammo.js physics engine
├── parts.js                # Part creation & management
├── joints.js               # Joint system
├── servoSystem.js          # Motor control
├── sensors.js              # Sensor simulation + environmental effects
├── timeline.js             # Recording/playback
├── minimap.js              # 2D minimap renderer
├── snapSystem.js           # Part snapping logic
├── ui.js                   # UI event handlers
├── codeGenerator.js        # Arduino C++ code export
├── projectManager.js       # Project save/load (IndexedDB)
├── style.css               # Styling
└── README.md               # This file
```

## 🚀 Future Enhancements

- [ ] WebSocket real-time collaboration
- [ ] Advanced physics constraints (prismatic, ball-and-socket)
- [ ] Custom PCB design editor
- [ ] Multi-robot simulation
- [ ] Real-time sensor data streaming
- [ ] Sensor calibration tools
- [ ] Environmental preset scenes

## 📄 License

BSD-3-Clause (see LICENSE file)
