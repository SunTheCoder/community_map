// src/indexedDB.js
import { openDB } from 'idb';



const dbPromise = openDB('communityAppDB', 1, {
  upgrade(db) {
    db.createObjectStore('resources', { keyPath: 'id' });
    db.createObjectStore('userData', { keyPath: 'username' });
  },
});

export const saveResource = async (resource, isSynced = false) => {
  const db = await dbPromise;
  resource.isSynced = isSynced; // Add the isSynced flag
  return db.put('resources', resource);
};

export const saveUserData = async (user) => {
  const db = await dbPromise;
  return db.put('userData', user);
};

export const getResources = async () => {
  const db = await dbPromise;
  return db.getAll('resources');
};

export const getUserData = async () => {
  const db = await dbPromise;
  return db.getAll('userData');
};

export const getUnsyncedResources = async () => {
    const db = await dbPromise;
    const allResources = await db.getAll('resources');
    return allResources.filter(resource => !resource.isSynced); // Filter unsynced resources
  };
  
  export const markAsSynced = async (resourceId) => {
    const db = await dbPromise;
    const resource = await db.get('resources', resourceId);
    resource.isSynced = true;
    return db.put('resources', resource);
  };

  export const syncUnsyncedResources = async () => {
    const unsyncedResources = await getUnsyncedResources();
    
    for (const resource of unsyncedResources) {
      try {
        await api.post('/resources', resource); // Sync to the backend
        await markAsSynced(resource.id); // Mark as synced in IndexedDB
      } catch (error) {
        console.error('Failed to sync resource:', error);
      }
    }
  };
