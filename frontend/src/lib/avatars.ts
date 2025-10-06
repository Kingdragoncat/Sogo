import md5 from 'md5';

/**
 * Get avatar URL for an email address using multiple strategies:
 * 1. BIMI (Brand Indicators for Message Identification) - verified company logos
 * 2. Gravatar - user-uploaded avatars
 * 3. Fallback to initials
 */

export interface AvatarResult {
  type: 'bimi' | 'gravatar' | 'initials';
  url?: string;
  initials?: string;
  verified?: boolean;
}

/**
 * Extract domain from email address
 */
function getDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

/**
 * Get initials from email or name
 */
export function getInitials(email: string, name?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
}

/**
 * Fetch BIMI logo via backend API
 * BIMI requires DNS TXT record at default._bimi.domain.com
 */
export async function getBIMILogo(email: string): Promise<string | null> {
  const domain = getDomain(email);
  if (!domain) return null;

  try {
    // Call backend to fetch BIMI record
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bimi/${domain}`);
    if (response.ok) {
      const data = await response.json();
      return data.logoUrl || null;
    }
  } catch (error) {
    console.debug('BIMI fetch failed:', error);
  }
  return null;
}

/**
 * Get Gravatar URL for email
 * Gravatar uses MD5 hash of lowercase email
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
}

/**
 * Check if Gravatar exists for email
 */
export async function hasGravatar(email: string): Promise<boolean> {
  try {
    const url = getGravatarUrl(email, 80);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the best avatar for an email address
 * Priority: BIMI > Gravatar > Initials
 */
export async function getAvatar(email: string, name?: string): Promise<AvatarResult> {
  // Try BIMI first (verified company logos)
  const bimiUrl = await getBIMILogo(email);
  if (bimiUrl) {
    return {
      type: 'bimi',
      url: bimiUrl,
      verified: true,
    };
  }

  // Try Gravatar
  const gravatarExists = await hasGravatar(email);
  if (gravatarExists) {
    return {
      type: 'gravatar',
      url: getGravatarUrl(email),
      verified: false,
    };
  }

  // Fallback to initials
  return {
    type: 'initials',
    initials: getInitials(email, name),
    verified: false,
  };
}

/**
 * Synchronous version - returns Gravatar or initials (no BIMI)
 * Use this for immediate rendering, then upgrade with async version
 */
export function getAvatarSync(email: string, name?: string): AvatarResult {
  return {
    type: 'gravatar',
    url: getGravatarUrl(email),
    initials: getInitials(email, name),
    verified: false,
  };
}
