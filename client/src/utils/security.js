


import CryptoJS from 'crypto-js';


const validateEnv = () => {
  if (!process.env.REACT_APP_ENCRYPTION_KEY) {
    console.error('Missing REACT_APP_ENCRYPTION_KEY in environment variables');
  }
  if (!process.env.REACT_APP_API_BASE_URL) {
    console.error('Missing REACT_APP_API_BASE_URL in environment variables');
  }
};
validateEnv();


const SECURITY_CONFIG = {
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  TOKEN_KEY: 'secure_app_token',
  TOKEN_REFRESH_INTERVAL: 
    (parseInt(process.env.REACT_APP_TOKEN_REFRESH_MINUTES) || 15) * 60 * 1000,
  MAX_API_RETRIES: 3,
  MIN_ENCRYPTION_KEY_LENGTH: 32
};


if (SECURITY_CONFIG.ENCRYPTION_KEY.length < SECURITY_CONFIG.MIN_ENCRYPTION_KEY_LENGTH) {
  console.warn(`Encryption key should be at least ${SECURITY_CONFIG.MIN_ENCRYPTION_KEY_LENGTH} characters long`);
}


const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value), 
        SECURITY_CONFIG.ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage setItem failed:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  getItem: (key) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const bytes = CryptoJS.AES.decrypt(data, SECURITY_CONFIG.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        console.warn('Decryption returned empty result - possibly wrong key');
        return null;
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Secure storage getItem failed:', error);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};


const secureFetch = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${SECURITY_CONFIG.API_BASE_URL}${endpoint}`;
  
  try {
    const token = secureStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin'
    });

    
    if (response.status === 401) {
      secureStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
      throw new Error('Session expired - please reauthenticate');
    }

    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retryCount < SECURITY_CONFIG.MAX_API_RETRIES) {
      console.warn(`Retrying API call (${retryCount + 1}/${SECURITY_CONFIG.MAX_API_RETRIES})`);
      return secureFetch(endpoint, options, retryCount + 1);
    }
    
    console.error('API request failed after retries:', error);
    throw error;
  }
};


const handleFullscreen = async (element = document.documentElement) => {
  try {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
      return true;
    } else {
      await document.exitFullscreen();
      return false;
    }
  } catch (error) {
    console.error('Fullscreen operation failed:', error);
    throw error;
  }
};


const tokenService = {
  getToken: () => secureStorage.getItem(SECURITY_CONFIG.TOKEN_KEY),
  
  setToken: (token) => {
    secureStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, token);
  },
  
  clearToken: () => {
    secureStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
  },
  
  refreshToken: async () => {
    try {
      const token = secureStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
      if (!token) return null;
      
      const newToken = await secureFetch('/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      
      secureStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      secureStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
      return null;
    }
  }
};

export {
  secureStorage,
  secureFetch,
  handleFullscreen,
  tokenService,
  SECURITY_CONFIG
};