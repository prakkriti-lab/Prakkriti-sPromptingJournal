# 🖼️ ROBOPTIXX Images Setup Guide

## What I Did (Code Changes)

✅ **Custom Part Naming System**
- Added robot part names: Hexagonal, Dog_Core, Lifting_Limb, Running_Limb, etc.
- Auto-naming with counters (e.g., Lifting_Limb_1, Lifting_Limb_2)
- Names editable in inspector

✅ **Image Asset System**
- Image preview box in inspector (120px)
- Show part name, ID, category
- Image paths stored with part data
- Save/load images with projects

✅ **Arduino Code with Part Names**
- Generated code includes part names in comments
- Joint descriptions with meaningful names
- Professional documentation

✅ **Folder Structure Created**
```
assets/images/
├── cores/              (Hexagonal, Dog_Core)
├── limbs/              (Lifting_Limb, Running_Limb, etc)
├── joints/             (Pivotal_Joint, Axle, etc)
├── cushioning/         (Cushioning_Roller_1, 2)
├── sensors/            (optional)
└── tools/              (optional)
```

---

## What You Need To Do (Image Organization)

### Step 1: Prepare Your 20 Images

From: `C:\Users\paris\Downloads\Assets\`

**Organize by Part Type:**

```
Local folder structure:
C:\Users\paris\Downloads\Assets\
├── hexagonal/
│   ├── hex_1.png
│   └── hex_2.png
│
├── lifting_limbs/
│   ├── lifting_1.png
│   ├── lifting_2.png
│   └── lifting_3.png
│
├── running_limbs/
│   ├── running_1.png
│   ├── running_2.png
│   └── running_3.png
│
├── other_limbs/
│   ├── hilly_1.png
│   ├── crew_1.png
│   ├── spider_1.png
│   └── clawed_1.png
│
├── joints/
│   ├── pivotal_1.png
│   ├── axle_1.png
│   ├── rolling_hinge_1.png
│   └── hinge_1.png
│
└── cushioning/
    ├── roller_1_1.png
    └── roller_2_1.png
```

### Step 2: Rename Images

**Naming convention:**
```
{part_name}_{number}.{extension}

Examples:
- hexagonal_1.png
- lifting_limb_1.png
- running_limb_1.png
- pivotal_joint_1.png
- cushioning_roller_1_1.png
```

**Using Windows:**
```
1. Select all images in a folder
2. Right click → Rename
3. Type: hexagonal
4. Auto-rename: hexagonal (1).png → hexagonal_1.png (manually or with tool)
```

**Or use free tool:**
- Advanced Renamer: https://www.advancedrenamer.com/
- Bulk Rename Utility (Windows)

### Step 3: Upload to GitHub

**Option A: GitHub .dev (Easiest)**

```
1. Open: https://github.com/prakkriti-lab/Prakkriti-sPromptingJournal
2. Press: . (dot key)
3. Navigate to: assets/images/
4. Drag & drop images from local folder
5. GitHub auto-uploads!
6. Commit: "Add 20 robot part images"
```

**Option B: Direct GitHub Upload**

```
1. GitHub repo → assets/images/cores/
2. Click: Add file → Upload files
3. Drag & drop images
4. Repeat for other folders (limbs, joints, etc)
5. Commit all
```

### Step 4: Test in ROBOPTIXX

```
1. Wait 2-5 minutes (GitHub Pages deploy)
2. Open: https://prakkriti-lab.github.io/Prakkriti-sPromptingJournal/
3. Create a part: Category → Limbs → + Cylinder
4. Select it
5. Inspector should show:
   - Part Name: Lifting_Limb_1 ✅
   - Image preview: [thumbnail] ✅
```

---

## Expected Behavior

### When You Create Parts:

```
Category: Cores
├─ Part 1 → Auto-name: Hexagonal_1
└─ Part 2 → Auto-name: Dog_Core_1

Category: Limbs
├─ Part 1 → Auto-name: Lifting_Limb_1
├─ Part 2 → Auto-name: Lifting_Limb_2
├─ Part 3 → Auto-name: Running_Limb_1
├─ Part 4 → Auto-name: Running_Limb_2
└─ ...

Category: Joints
├─ Part 1 → Auto-name: Pivotal_Joint_1
├─ Part 2 → Auto-name: Axle_1
└─ ...
```

### In Inspector:

```
🏷️ Part Details
┌────────────────────────┐
│ Name: Lifting_Limb_1   │ (editable)
│ ID: part_2             │ (readonly)
│ Category: Limbs        │ (readonly)
│                        │
│  [Image Preview Area]  │
│                        │
│  lifting_limb_1.png    │
│                        │
└────────────────────────┘
```

### Arduino Export:

```cpp
// ROBOPTIXX Auto-Generated Robot Controller

// ========== PART DECLARATIONS ==========
// Hexagonal_1 (Category: Cores, Mass: 2kg)
// Lifting_Limb_1 (Category: Limbs, Mass: 1kg)
// Running_Limb_1 (Category: Limbs, Mass: 0.8kg)

// ========== JOINT DECLARATIONS ==========
Servo servo_0; // Lifting_Limb_1 <-> Hexagonal_1
Servo servo_1; // Running_Limb_1 <-> Hexagonal_1

// ========== SETUP ==========
void setup() {
  Serial.begin(9600);
  Serial.println("ROBOPTIXX Robot Initialized");
  
  servo_0.attach(9);  // Lifting_Limb_1
  servo_1.attach(10); // Running_Limb_1
}
```

---

## Timeline

```
Now:        Code is ready! ✅ (All changes pushed)

You need:   
  ├─ Organize 20 images (5 min)
  ├─ Rename images (5 min)
  └─ Upload to GitHub (5 min)
           ↓
GitHub:     Auto-deploy (2-5 min)
           ↓
Test:       ROBOPTIXX with images (2 min)
           ↓
Done!       Fully integrated system! 🎉
```

---

## Checklist

- [ ] Code changes pushed to GitHub ✅ (DONE!)
- [ ] 20 images organized locally
- [ ] Images renamed (hexagonal_1.png, etc)
- [ ] Images uploaded to assets/images/ folders
- [ ] Commit message: "Add 20 robot part images"
- [ ] Push to GitHub
- [ ] Wait for GitHub Pages deploy (2-5 min)
- [ ] Test in ROBOPTIXX
  - [ ] Create part
  - [ ] Check image preview
  - [ ] Check auto-naming
  - [ ] Export Arduino code

---

## File Reference

### Code Changes Made:
- `parts.js` - Custom naming + asset tracking
- `ui.js` - Inspector UI + image preview
- `index.html` - New inspector layout
- `projectManager.js` - Save/load names & images
- `codeGenerator.js` - Part names in code
- `assets/images/README.md` - Guide

### Folder Created:
- `assets/images/` - All subfolders ready

---

## Next Steps

1. **Get your 20 images organized**
2. **Upload to GitHub assets/images/ folders**
3. **Test ROBOPTIXX with image preview**
4. **Build your robot with named parts!**

---

**Everything is ready on the code side! Just organize & upload your images!** 🚀

Questions? Check:
- `assets/images/README.md` (in GitHub)
- `IMAGES_SETUP_GUIDE.md` (this file)
