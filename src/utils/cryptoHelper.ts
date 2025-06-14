/**
 * Derives a secure encryption key from a password
 */
export async function getEncryptionKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts and stores data in localStorage
 */
export async function encryptAndStore(data: string, key: CryptoKey): Promise<void> {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );

  // Store IV + encrypted data
  localStorage.setItem(
    'encrypted-api-key',
    JSON.stringify({
      iv: Array.from(iv).join(','),
      data: Array.from(new Uint8Array(encrypted)).join(','),
    })
  );
}

/**
 * Decrypts data from localStorage
 */
export async function decryptStoredKey(key: CryptoKey): Promise<string> {
  const storedData = localStorage.getItem('encrypted-api-key');
  if (!storedData) return '';

  const { iv, data } = JSON.parse(storedData);
  const ivArray = new Uint8Array(iv.split(',').map(Number));
  const dataArray = new Uint8Array(data.split(',').map(Number));

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivArray },
    key,
    dataArray
  );

  return new TextDecoder().decode(decrypted);
}