// Cloud imports handler - loads all dependencies from CDN
// This file handles WASM initialization and provides a unified import interface

export let THREE = null;
export let Ammo = null;

const CDN_URLS = {
  THREE: 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js',
  THREE_ORBIT: 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/controls/OrbitControls.js',
  THREE_TRANSFORM: 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/controls/TransformControls.js',
  AMMO_WASM: 'https://cdn.jsdelivr.net/npm/ammo.js@0.0.9/builds/ammo.wasm.js'
};

export async function initCloudEnvironment() {
  try {
    console.log('[ROBOPTIXX] Initializing cloud environment...');
    
    // Load Three.js
    THREE = await import(CDN_URLS.THREE).then(m => m.default || m);
    if (!THREE) throw new Error('Failed to load Three.js');
    console.log('[ROBOPTIXX] ✓ Three.js loaded');

    // Load Ammo.js WASM
    const AmmoModule = await import(CDN_URLS.AMMO_WASM);
    const AmmoFactory = AmmoModule.default || AmmoModule;
    Ammo = await AmmoFactory();
    if (!Ammo) throw new Error('Failed to initialize Ammo.js');
    console.log('[ROBOPTIXX] ✓ Ammo.js WASM loaded');

    return { THREE, Ammo };
  } catch (error) {
    console.error('[ROBOPTIXX] Cloud environment initialization failed:', error);
    throw error;
  }
}

export async function loadThreeControls() {
  try {
    const [OrbitModule, TransformModule] = await Promise.all([
      import(CDN_URLS.THREE_ORBIT),
      import(CDN_URLS.THREE_TRANSFORM)
    ]);
    
    return {
      OrbitControls: OrbitModule.OrbitControls || OrbitModule.default.OrbitControls,
      TransformControls: TransformModule.TransformControls || TransformModule.default.TransformControls
    };
  } catch (error) {
    console.error('[ROBOPTIXX] Failed to load Three.js controls:', error);
    throw error;
  }
}
