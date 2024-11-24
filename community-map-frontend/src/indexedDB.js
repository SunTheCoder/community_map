// src/indexedDB.js
import { openDB } from 'idb';
import api from './api/api';



const dbPromise = openDB('communityAppDB', 1, {
  upgrade(db) {
    db.createObjectStore('resources', { keyPath: 'id' });
    db.createObjectStore('userData', { keyPath: 'username' });
  },
});

export const saveResource = async (resourceData, isSynced) => {
  // Ensure the resource has an `id`
  const dataToSave = {
    ...resourceData,
    id: resourceData.id || Date.now(), // Generate an ID if missing
    isSynced,
  };

  try {
    const db = await dbPromise;
    await db.put("resources", dataToSave); // Save to IndexedDB
    console.log("Resource saved successfully:", dataToSave);
  } catch (error) {
    console.error("Error saving to IndexedDB:", error);
  }
};


export const saveUserData = async (user) => {
    try {
      const db = await dbPromise;
      return db.put('userData', user);
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
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
