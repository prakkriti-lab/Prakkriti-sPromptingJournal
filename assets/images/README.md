# ROBOPTIXX Assets - Images Folder

This folder contains all robot part images organized by category.

## Folder Structure

```
assets/images/
├── cores/              # Core/Body parts
│   ├── hexagonal_1.png
│   ├── hexagonal_2.png
│   ├── dog_core_1.png
│   └── dog_core_2.png
│
├── limbs/              # Limbs for movement
│   ├── lifting_limb_1.png
│   ├── lifting_limb_2.png
│   ├── running_limb_1.png
│   ├── running_limb_2.png
│   ├── hilly_region_limb_1.png
│   ├── hilly_region_limb_2.png
│   ├── crew_limb_1.png
│   ├── crew_limb_2.png
│   ├── spider_limb_1.png
│   ├── spider_limb_2.png
│   ├── clawed_limb_1.png
│   └── clawed_limb_2.png
│
├── joints/             # Joints/Connectors
│   ├── pivotal_joint_1.png
│   ├── pivotal_joint_2.png
│   ├── axle_1.png
│   ├── axle_2.png
│   ├── rolling_hinge_1.png
│   ├── rolling_hinge_2.png
│   ├── hinge_1.png
│   └── hinge_2.png
│
├── cushioning/         # Protection parts
│   ├── cushioning_roller_1_1.png
│   ├── cushioning_roller_1_2.png
│   ├── cushioning_roller_2_1.png
│   └── cushioning_roller_2_2.png
│
├── sensors/            # Sensor parts (optional)
│   ├── distance_sensor_1.png
│   ├── pressure_sensor_1.png
│   ├── gyro_sensor_1.png
│   ├── imu_sensor_1.png
│   └── camera_sensor_1.png
│
└── tools/              # Tool parts (optional)
    ├── gripper_left_1.png
    ├── gripper_right_1.png
    ├── drill_tool_1.png
    └── cutter_tool_1.png
```

## How to Add Images

1. Prepare your robot part images (PNG or JPG)
2. Rename according to part names (see above)
3. Place in appropriate category folder
4. Images will auto-load in ROBOPTIXX inspector

## Naming Convention

- **Format**: `{part_name}_{number}.{extension}`
- **Examples**:
  - `hexagonal_1.png`
  - `lifting_limb_2.jpg`
  - `pivotal_joint_1.png`

## Image Specifications

- **Recommended size**: 200x200px - 500x500px
- **Format**: PNG (transparent bg) or JPG
- **Quality**: High resolution (2x or 3x for clarity)
- **Background**: Transparent preferred for parts

## Integration in ROBOPTIXX

When you create a part with name "Lifting_Limb", ROBOPTIXX will:
1. Look for images in `assets/images/limbs/`
2. Match images starting with `lifting_limb_`
3. Display first match in inspector preview

## Optimizing Images

For faster loading:
- Use TinyPNG.com to compress
- Keep under 500KB per image
- Use PNG for parts with transparency
- Use JPG for rendered 3D views
