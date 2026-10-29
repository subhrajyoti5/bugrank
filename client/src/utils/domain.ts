/**
 * Domain & Subdomain utilities for BugRank
 * Separates marketing landing site (bugrank.in / www.bugrank.in)
 * from the web application (app.bugrank.in).
 */

export const isClient = typeof window !== 'undefined';

export const getHostname = (): string => {
  if (!isClient) return '';
  return window.location.hostname.toLowerCase();
};

/**
 * Returns true if the current page is on the web app subdomain:
 * - In production: app.bugrank.in
 * - In development: supports localhost with ?app=true, app.localhost, or any hostname starting with 'app.'
 */
export const isAppSubdomain = (): boolean => {
  if (!isClient) return false;
  const hostname = getHostname();

  // Explicit app subdomain
  if (hostname === 'app.bugrank.in' || hostname.startsWith('app.')) {
    return true;
  }

  // Development convenience override
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('app') === 'true') return true;
    if (params.get('landing') === 'true') return false;
  }

  return false;
};

/**
 * Returns true if the user is visiting the marketing landing domain:
 * - bugrank.in
 * - www.bugrank.in
 * - bugrank-client.vercel.app
 */
export const isLandingDomain = (): boolean => {
  if (!isClient) return true;
  const hostname = getHostname();
  return (
    hostname === 'bugrank.in' ||
    hostname === 'www.bugrank.in' ||
    hostname.includes('vercel.app') ||
    (!isAppSubdomain() && (hostname === 'localhost' || hostname === '127.0.0.1'))
  );
};

export const isProduction = (): boolean => {
  if (!isClient) return false;
  const hostname = getHostname();
  return hostname.includes('bugrank.in') || hostname.includes('vercel.app');
};

/**
 * Get target URL for the web app (app.bugrank.in)
 * In production: https://app.bugrank.in${path}
 * In localhost: ${path}
 */
export const getAppUrl = (path: string = ''): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (isProduction()) {
    return `https://app.bugrank.in${normalizedPath}`;
  }
  return normalizedPath;
};

/**
 * Get target URL for the marketing landing site (www.bugrank.in)
 * In production: https://www.bugrank.in${path}
 * In localhost: ${path}
 */
export const getLandingUrl = (path: string = ''): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (isProduction()) {
    return `https://www.bugrank.in${normalizedPath}`;
  }
  return normalizedPath;
};

