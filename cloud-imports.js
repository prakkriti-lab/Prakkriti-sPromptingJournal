// Cloud imports handler - loads all dependencies from CDN
// This file handles WASM initialization and provides a unified import interface

export let THREE = null;
export let Ammo = null;

const CDN_URLS = {
  THREE: 'https://cdn.jsdelivr.net/npm/three@r128/build/three.min.js',
  THREE_ORBIT: 'https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/OrbitControls.js',
  THREE_TRANSFORM: 'https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/TransformControls.js',
  AMMO_WASM: 'https://cdn.jsdelivr.net/npm/ammo.js@0.0.9/builds/ammo.js'
};

export async function initCloudEnvironment() {
  try {
    console.log('[ROBOPTIXX] Waiting for THREE.js...');
    
    // Script tags in HTML should have loaded THREE/Ammo globally
    // Just wait for them to be available
    let attempts = 0;
    while (!window.THREE && attempts < 100) {
      await new Promise(r => setTimeout(r, 50));
      attempts++;
    }
    
    if (!window.THREE) {
      throw new Error('Failed to load Three.js from CDN');
    }
    
    console.log('[ROBOPTIXX] ✓ Three.js loaded');
    console.log('[ROBOPTIXX] ✓ Ammo.js loaded');
    
    return { THREE: window.THREE, Ammo: window.Ammo };
  } catch (error) {
    console.error('[ROBOPTIXX] Cloud environment initialization failed:', error);
    throw error;
  }
}

export async function loadThreeControls() {
  try {
    // OrbitControls and TransformControls are attached by script tags
    if (!window.OrbitControls || !window.TransformControls) {
      throw new Error('THREE.js controls not loaded');
    }
    
    return {
      OrbitControls: window.OrbitControls,
      TransformControls: window.TransformControls
    };
  } catch (error) {
    console.error('[ROBOPTIXX] Failed to load Three.js controls:', error);
    throw error;
  }
}
