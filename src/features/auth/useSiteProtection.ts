import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'af_site_access_token';
const EXPIRY_KEY = 'af_site_access_expiry';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Simple deterministic hash helper for token validation
async function hashString(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash if subtle crypto is unavailable
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}

export function useSiteProtection() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isProtectionRequired, setIsProtectionRequired] = useState<boolean>(false);

  // Retrieve valid passwords from environment or default fallbacks
  const getValidPasswords = useCallback((): string[] => {
    const envPassword = import.meta.env.VITE_SITE_PASSWORD;
    if (envPassword && typeof envPassword === 'string' && envPassword.trim()) {
      return envPassword.split(',').map((p: string) => p.trim()).filter(Boolean);
    }
    // Default fallback passwords for preview deployments
    return ['activity2025', 'preview', 'activityfinder'];
  }, []);

  // Determine if protection is required based on domain or env settings
  const checkProtectionRequired = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    const hostname = window.location.hostname;
    const isVercelDomain = hostname.endsWith('.vercel.app') || hostname.includes('vercel.app');
    const isExplicitlyEnabled = import.meta.env.VITE_ENABLE_PASSWORD_PROTECTION === 'true';
    const hasConfiguredPassword = Boolean(import.meta.env.VITE_SITE_PASSWORD);
    
    // Check if test URL flag is passed in development: ?lock=1
    const searchParams = new URLSearchParams(window.location.search);
    const isTestLock = searchParams.get('lock') === '1' || searchParams.get('protect') === '1';

    return isVercelDomain || isExplicitlyEnabled || hasConfiguredPassword || isTestLock;
  }, []);

  // Check stored auth session
  useEffect(() => {
    const checkAuthStatus = async () => {
      const required = checkProtectionRequired();
      setIsProtectionRequired(required);

      if (!required) {
        setIsUnlocked(true);
        setIsChecking(false);
        return;
      }

      const validPasswords = getValidPasswords();
      const validHashes = await Promise.all(validPasswords.map((p) => hashString(p)));

      // 1. Check URL query params for quick access bypass (e.g. ?pass=... or ?access_key=...)
      const searchParams = new URLSearchParams(window.location.search);
      const urlKey = searchParams.get('pass') || searchParams.get('access_key') || searchParams.get('preview_key');
      if (urlKey) {
        const urlHash = await hashString(urlKey);
        if (validHashes.includes(urlHash) || validPasswords.includes(urlKey.trim())) {
          // Store token in session
          sessionStorage.setItem(STORAGE_KEY, urlHash);
          setIsUnlocked(true);
          setIsChecking(false);
          // Clean URL parameter without reloading
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
          return;
        }
      }

      // 2. Check localStorage (persistent) or sessionStorage
      const localToken = localStorage.getItem(STORAGE_KEY);
      const localExpiry = localStorage.getItem(EXPIRY_KEY);
      const sessionToken = sessionStorage.getItem(STORAGE_KEY);

      if (localToken && localExpiry) {
        const expiryTime = parseInt(localExpiry, 10);
        if (Date.now() < expiryTime && validHashes.includes(localToken)) {
          setIsUnlocked(true);
          setIsChecking(false);
          return;
        } else {
          // Expired or invalid
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(EXPIRY_KEY);
        }
      }

      if (sessionToken && validHashes.includes(sessionToken)) {
        setIsUnlocked(true);
        setIsChecking(false);
        return;
      }

      // Locked
      setIsUnlocked(false);
      setIsChecking(false);
    };

    checkAuthStatus();
  }, [checkProtectionRequired, getValidPasswords]);

  // Unlock action
  const unlockSite = useCallback(
    async (inputPassword: string, rememberDevice: boolean = true): Promise<boolean> => {
      const trimmed = inputPassword.trim();
      if (!trimmed) return false;

      const validPasswords = getValidPasswords();
      const inputHash = await hashString(trimmed);
      const validHashes = await Promise.all(validPasswords.map((p) => hashString(p)));

      const isValid = validHashes.includes(inputHash) || validPasswords.includes(trimmed);

      if (isValid) {
        if (rememberDevice) {
          localStorage.setItem(STORAGE_KEY, inputHash);
          localStorage.setItem(EXPIRY_KEY, (Date.now() + THIRTY_DAYS_MS).toString());
        } else {
          sessionStorage.setItem(STORAGE_KEY, inputHash);
        }
        setIsUnlocked(true);
        return true;
      }

      return false;
    },
    [getValidPasswords]
  );

  // Lock action (for user menu / testing)
  const lockSite = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setIsUnlocked(false);
  }, []);

  return {
    isUnlocked,
    isChecking,
    isProtectionRequired,
    unlockSite,
    lockSite,
    defaultHint: import.meta.env.DEV ? 'activity2025' : undefined,
  };
}
