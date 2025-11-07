/**
 * Offline Storage Utility for OmniBlocks
 * Provides IndexedDB-based storage for projects and user data
 */

const DB_NAME = 'OmniBlocksOfflineDB';
const DB_VERSION = 1;
const PROJECTS_STORE = 'projects';
const PENDING_SAVES_STORE = 'pendingSaves';

class OfflineStorage {
    constructor() {
        this.db = null;
        this.isSupported = this.checkSupport();
    }

    checkSupport() {
        return 'indexedDB' in window;
    }

    async init() {
        if (!this.isSupported) {
            console.warn('[OfflineStorage] IndexedDB not supported');
            return false;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to open database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('[OfflineStorage] Database opened successfully');
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('[OfflineStorage] Upgrading database...');

                // Create projects store
                if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
                    const projectsStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
                    projectsStore.createIndex('title', 'title', { unique: false });
                    projectsStore.createIndex('lastModified', 'lastModified', { unique: false });
                }

                // Create pending saves store
                if (!db.objectStoreNames.contains(PENDING_SAVES_STORE)) {
                    const pendingStore = db.createObjectStore(PENDING_SAVES_STORE, { keyPath: 'id' });
                    pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async saveProject(projectData) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const project = {
            id: projectData.id || this.generateId(),
            title: projectData.title || 'Untitled Project',
            data: projectData.data,
            lastModified: Date.now(),
            isOffline: !navigator.onLine
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PROJECTS_STORE], 'readwrite');
            const store = transaction.objectStore(PROJECTS_STORE);
            const request = store.put(project);

            request.onsuccess = () => {
                console.log('[OfflineStorage] Project saved:', project.id);
                resolve(project);
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to save project:', request.error);
                reject(request.error);
            };
        });
    }

    async getProject(projectId) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PROJECTS_STORE], 'readonly');
            const store = transaction.objectStore(PROJECTS_STORE);
            const request = store.get(projectId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to get project:', request.error);
                reject(request.error);
            };
        });
    }

    async getAllProjects() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PROJECTS_STORE], 'readonly');
            const store = transaction.objectStore(PROJECTS_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to get all projects:', request.error);
                reject(request.error);
            };
        });
    }

    async deleteProject(projectId) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PROJECTS_STORE], 'readwrite');
            const store = transaction.objectStore(PROJECTS_STORE);
            const request = store.delete(projectId);

            request.onsuccess = () => {
                console.log('[OfflineStorage] Project deleted:', projectId);
                resolve();
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to delete project:', request.error);
                reject(request.error);
            };
        });
    }

    async addPendingSave(projectData) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const pendingSave = {
            id: this.generateId(),
            data: projectData,
            timestamp: Date.now()
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PENDING_SAVES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SAVES_STORE);
            const request = store.put(pendingSave);

            request.onsuccess = () => {
                console.log('[OfflineStorage] Pending save added:', pendingSave.id);
                resolve(pendingSave);
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to add pending save:', request.error);
                reject(request.error);
            };
        });
    }

    async getPendingSaves() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PENDING_SAVES_STORE], 'readonly');
            const store = transaction.objectStore(PENDING_SAVES_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to get pending saves:', request.error);
                reject(request.error);
            };
        });
    }

    async removePendingSave(saveId) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PENDING_SAVES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SAVES_STORE);
            const request = store.delete(saveId);

            request.onsuccess = () => {
                console.log('[OfflineStorage] Pending save removed:', saveId);
                resolve();
            };

            request.onerror = () => {
                console.error('[OfflineStorage] Failed to remove pending save:', request.error);
                reject(request.error);
            };
        });
    }

    async clearAllData() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([PROJECTS_STORE, PENDING_SAVES_STORE], 'readwrite');
            
            const projectsStore = transaction.objectStore(PROJECTS_STORE);
            const pendingStore = transaction.objectStore(PENDING_SAVES_STORE);
            
            const clearProjects = projectsStore.clear();
            const clearPending = pendingStore.clear();

            transaction.oncomplete = () => {
                console.log('[OfflineStorage] All data cleared');
                resolve();
            };

            transaction.onerror = () => {
                console.error('[OfflineStorage] Failed to clear data:', transaction.error);
                reject(transaction.error);
            };
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    async getStorageUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    used: estimate.usage,
                    available: estimate.quota,
                    percentage: Math.round((estimate.usage / estimate.quota) * 100)
                };
            } catch (error) {
                console.warn('[OfflineStorage] Could not get storage estimate:', error);
                return null;
            }
        }
        return null;
    }
}

// Create singleton instance
const offlineStorage = new OfflineStorage();

// Auto-initialize when module is loaded
offlineStorage.init().catch(error => {
    console.error('[OfflineStorage] Failed to initialize:', error);
});

export default offlineStorage;