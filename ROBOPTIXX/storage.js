// IndexedDB Storage Manager - persists projects to browser storage (no file system needed)

const DB_NAME = 'RobotSimDB';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

let db = null;

export async function initStorage() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    
    request.onsuccess = () => {
      db = request.result;
      console.log('[ROBOPTIXX] ✓ IndexedDB initialized');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveProject(projectName, projectData) {
  if (!db) throw new Error('Database not initialized');
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const data = {
      id: projectName,
      name: projectName,
      data: projectData,
      timestamp: Date.now()
    };
    
    const request = store.put(data);
    request.onerror = () => reject(new Error('Failed to save project'));
    request.onsuccess = () => {
      console.log(`[ROBOPTIXX] Project "${projectName}" saved`);
      resolve(data);
    };
  });
}

export async function loadProject(projectName) {
  if (!db) throw new Error('Database not initialized');
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(projectName);
    
    request.onerror = () => reject(new Error('Failed to load project'));
    request.onsuccess = () => {
      if (request.result) {
        console.log(`[ROBOPTIXX] Project "${projectName}" loaded`);
        resolve(request.result.data);
      } else {
        reject(new Error(`Project "${projectName}" not found`));
      }
    };
  });
}

export async function listProjects() {
  if (!db) throw new Error('Database not initialized');
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(new Error('Failed to list projects'));
    request.onsuccess = () => {
      resolve(request.result.map(p => ({ name: p.name, timestamp: p.timestamp })));
    };
  });
}

export async function deleteProject(projectName) {
  if (!db) throw new Error('Database not initialized');
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(projectName);
    
    request.onerror = () => reject(new Error('Failed to delete project'));
    request.onsuccess = () => {
      console.log(`[ROBOPTIXX] Project "${projectName}" deleted`);
      resolve();
    };
  });
}

export function exportProjectJSON(projectData) {
  return JSON.stringify(projectData, null, 2);
}

export function importProjectJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}
