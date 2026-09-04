# ROBOPTIXX - Image Filename Mapping

## Your Actual Images (16 total)

### CORES (Body/Base)
- **Anchor Hook** → Part name: `Anchor_Hook` → Category: Cores
- **Spade** → Part name: `Spade` → Category: Cores

### LIMBS (Movement)
- **Lifting Limb** → Part name: `Lifting_Limb` → Category: Limbs
- **Running Limb** → Part name: `Running_Limb` → Category: Limbs
- **Sandy/Hilly Region Limb** → Part name: `Hilly_Region_Limb` → Category: Limbs
- **Crew Limb** → Part name: `Crew_Limb` → Category: Limbs
- **Spider Limb** → Part name: `Spider_Limb` → Category: Limbs
- **Clawed Limb** → Part name: `Clawed_Limb` → Category: Limbs
- **Paddle Limb** → Part name: `Paddle_Limb` → Category: Limbs
- **Screw Limb** → Part name: `Screw_Limb` → Category: Limbs

### JOINTS (Connectors)
- **Rolling Hinge** → Part name: `Rolling_Hinge` → Category: Joints
- **Gear Axle / Wheel Roller** → Part name: `Gear_Axle` → Category: Joints
- **Wheel Roller** → Part name: `Wheel_Roller` → Category: Joints

### CUSHIONING (Protection)
- **Cushioning Roller 2** → Part name: `Cushioning_Roller_2` → Category: Cushioning

### TOOLS/SPECIAL
- **Cartwheel** → Part name: `Cartwheel` → Category: Tools
- **Airshot** → Part name: `Airshot` → Category: Tools

---

## How It Works

1. **Upload Images to GitHub**
   - Place images in `assets/images/` folder
   - Filenames MUST match exactly as shown above
   - No need to rename!

2. **When You Create Parts in ROBOPTIXX**
   - Select category (Cores, Limbs, Joints, etc)
   - Click part shape button
   - Part auto-names based on category
   - Image auto-loads if filename matches!

3. **Example Workflow**
   ```
   Category: Limbs
   Click: + Cylinder
   Auto-name: Lifting_Limb_1
   Image loads: Lifting Limb (if exists in assets/images/)
   Inspector shows: [image preview]
   ```

---

## Upload Instructions

### Files to Upload

Place these 16 image files in: `assets/images/`

```
assets/images/
├── Anchor Hook.[extension]
├── Spade.[extension]
├── Clawed Limb.[extension]
├── Crew Limb.[extension]
├── Cushioning Roller 2.[extension]
├── Lifting Limb.[extension]
├── Sandy/Hilly Region Limb.[extension]
├── Spider Limb.[extension]
├── Running Limb.[extension]
├── Rolling Hinge.[extension]
├── Gear Axle / Wheel Roller.[extension]
├── Wheel Roller.[extension]
├── Paddle Limb.[extension]
├── Screw Limb.[extension]
├── Cartwheel.[extension]
└── Airshot.[extension]
```

---

## Step-by-Step Upload

1. **GitHub .dev খোল**
   ```
   https://github.com/prakkriti-lab/Prakkriti-sPromptingJournal
   Press: . (dot key)
   ```

2. **Navigate to assets/images/**
   ```
   Left sidebar → assets → images
   ```

3. **Drag & drop your 16 images**
   ```
   From: C:\Users\paris\Downloads\Assets\
   To: GitHub .dev assets/images/ folder
   ```

4. **Commit**
   ```
   Message: "Add 16 robot part images - exact filenames"
   Commit changes
   Push to GitHub
   ```

5. **Wait 2-5 minutes for GitHub Pages deploy**

6. **Test in ROBOPTIXX**
   ```
   https://prakkriti-lab.github.io/Prakkriti-sPromptingJournal/
   
   Create part → Select category → See image preview!
   ```

---

## Filename Important!

✅ **CORRECT:**
- `Lifting Limb.png`
- `Running Limb.jpg`
- `Rolling Hinge.jpeg`

❌ **WRONG (won't load images):**
- `lifting_limb.png` (underscore instead of space)
- `Lifting Limb.PNG` (wrong case)
- `Lifting-Limb.png` (dash instead of space)

**Filenames must match EXACTLY as listed above!**

---

## Total Images

- **Cores:** 2 images
- **Limbs:** 8 images
- **Joints:** 3 images
- **Cushioning:** 1 image
- **Tools:** 2 images
- **TOTAL:** 16 images

Perfect! Ready to go! 🚀
