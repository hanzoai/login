// Organization configurations - fork this repo and customize for your org
export interface OrgConfig {
  id: string
  name: string
  displayName: string

  // IAM endpoints
  iamUrl: string
  clientId: string

  // Branding
  logo: string           // Path to logo SVG/PNG
  favicon: string        // Path to favicon

  // Theme
  theme: {
    background: string   // Page background
    surface: string      // Card/form background
    primary: string      // Primary button color
    primaryHover: string
    text: string         // Main text color
    textMuted: string    // Secondary text
    border: string       // Input borders
    borderFocus: string
  }

  // Content
  tagline?: string       // Optional tagline under logo
  footerText?: string    // Optional footer (e.g., "Powered by...")

  // Features
  enableSignup: boolean
  enablePasswordLogin: boolean
  enableCodeLogin: boolean
  enableWebAuthn: boolean
  enableFaceId: boolean

  // URLs
  homepageUrl: string
  termsUrl?: string
  privacyUrl?: string
}

// Default Hanzo config
export const hanzo: OrgConfig = {
  id: 'hanzo',
  name: 'hanzo',
  displayName: 'Hanzo',
  iamUrl: 'https://iam.hanzo.ai',
  clientId: 'hanzo-app-client-id',
  logo: '/logos/hanzo.svg',
  favicon: '/favicons/hanzo.svg',
  theme: {
    background: '#0a0a0f',
    surface: '#141419',
    primary: '#ffffff',
    primaryHover: '#e5e5e5',
    text: '#ffffff',
    textMuted: '#888888',
    border: '#333333',
    borderFocus: '#555555',
  },
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: true,
  enableFaceId: true,
  homepageUrl: 'https://hanzo.ai',
  termsUrl: 'https://hanzo.ai/terms',
  privacyUrl: 'https://hanzo.ai/privacy',
}

// Lux - Blockchain identity (financial/bank style)
export const lux: OrgConfig = {
  id: 'lux',
  name: 'lux',
  displayName: 'Lux',
  iamUrl: 'https://iam.hanzo.ai',
  clientId: 'lux-app-client-id',
  logo: '/logos/lux.svg',
  favicon: '/favicons/lux.svg',
  theme: {
    background: '#050508',
    surface: '#0c0c10',
    primary: '#ffffff',
    primaryHover: '#e5e5e5',
    text: '#ffffff',
    textMuted: '#666666',
    border: '#222222',
    borderFocus: '#444444',
  },
  tagline: 'Blockchain Identity',
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: true,
  enableFaceId: true,
  homepageUrl: 'https://lux.network',
  termsUrl: 'https://lux.network/terms',
  privacyUrl: 'https://lux.network/privacy',
}

// Pars - Persian global community network
export const pars: OrgConfig = {
  id: 'pars',
  name: 'pars',
  displayName: 'Pars',
  iamUrl: 'https://iam.hanzo.ai',
  clientId: 'pars-app-client-id',
  logo: '/logos/pars.svg',
  favicon: '/favicons/pars.svg',
  theme: {
    background: '#050508',
    surface: '#0c0c10',
    primary: '#ffffff',
    primaryHover: '#e5e5e5',
    text: '#ffffff',
    textMuted: '#666666',
    border: '#222222',
    borderFocus: '#444444',
  },
  tagline: 'Global Persian Network',
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: true,
  enableFaceId: false,
  homepageUrl: 'https://pars.id',
  termsUrl: 'https://pars.id/terms',
  privacyUrl: 'https://pars.id/privacy',
}

// Export all orgs
export const organizations: Record<string, OrgConfig> = {
  hanzo,
  lux,
  pars,
}

// Get org config by hostname
export function getOrgByHost(host: string): OrgConfig {
  if (host.includes('lux.id')) return lux
  if (host.includes('pars.id')) return pars
  return hanzo
}
