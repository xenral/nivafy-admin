/**
 * Client ID management for device/browser identification
 * Generates and persists a unique UUID for this browser/device
 */

const CLIENT_ID_KEY = 'nivafy-admin-client-id';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or generate a persistent client ID for this browser/device
 * @returns UUID string
 */
export function getClientId(): string {
  if (typeof window === 'undefined') {
    // Server-side: generate temporary ID
    return generateUUID();
  }

  // Check localStorage for existing client ID
  let clientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    // Generate new client ID
    clientId = generateUUID();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  return clientId;
}

/**
 * Clear the stored client ID (useful for logout or reset)
 */
export function clearClientId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CLIENT_ID_KEY);
  }
}
