import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_UNIBAZAAR_CREDENTIAL; 

export const storeToken = (token) => {
  const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem('token', encrypted);
};

export const getToken = () => {
  const encrypted = localStorage.getItem('token');
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
};
