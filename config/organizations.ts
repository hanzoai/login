// Organization configurations - fork this repo and customize for your org
export interface SocialProvider {
  id: string             // Casdoor provider name (e.g., 'provider-github')
  type: string           // Provider type (github, google, facebook, apple, wallet)
  label: string          // Display label
}

export interface OrgConfig {
  id: string
  name: string
  displayName: string

  // IAM endpoints
  iamUrl: string
  clientId: string
  clientSecret: string
  casdoorOrg: string     // Casdoor organization name
  casdoorApp: string     // Casdoor application name

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
  enableWallet: boolean  // Web3 wallet connect (MetaMask, etc.)
  socialProviders: SocialProvider[]

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
  iamUrl: 'https://hanzo.id',
  clientId: 'hanzo-app-client-id',
  clientSecret: '3c7c4d9817bf0993681f6da2605e07ba5949da87a32862ed',
  casdoorOrg: 'hanzo',
  casdoorApp: 'app-hanzo',
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
  enableWallet: true,
  socialProviders: [
    { id: 'provider-google', type: 'google', label: 'Google' },
    { id: 'provider-github', type: 'github', label: 'GitHub' },
    { id: 'provider-apple', type: 'apple', label: 'Apple' },
  ],
  homepageUrl: 'https://hanzo.ai',
  termsUrl: 'https://hanzo.ai/terms',
  privacyUrl: 'https://hanzo.ai/privacy',
}

// Lux - Blockchain identity (financial/bank style)
export const lux: OrgConfig = {
  id: 'lux',
  name: 'lux',
  displayName: 'Lux',
  iamUrl: 'https://lux.id',
  clientId: 'lux-app-client-id',
  clientSecret: '2b750cdf20b3a4e5f6789012345678901234567890abcdef',
  casdoorOrg: 'lux',
  casdoorApp: 'app-lux',
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
  enableWallet: true,
  socialProviders: [],
  homepageUrl: 'https://lux.network',
  termsUrl: 'https://lux.network/terms',
  privacyUrl: 'https://lux.network/privacy',
}

// Pars - Persian global community network
export const pars: OrgConfig = {
  id: 'pars',
  name: 'pars',
  displayName: 'Pars',
  iamUrl: 'https://pars.id',
  clientId: 'pars-app-client-id',
  clientSecret: '38d12a87261234567890abcdef1234567890abcdef123456',
  casdoorOrg: 'pars',
  casdoorApp: 'app-pars',
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
  enableWallet: false,
  socialProviders: [],
  homepageUrl: 'https://pars.id',
  termsUrl: 'https://pars.id/terms',
  privacyUrl: 'https://pars.id/privacy',
}

// AdNexus - Programmatic advertising platform
export const adnexus: OrgConfig = {
  id: 'adnexus',
  name: 'adnexus',
  displayName: 'AdNexus',
  iamUrl: 'https://id.ad.nexus',
  clientId: 'adnexus-app-client-id',
  clientSecret: 'afcb24af6b1289f8ec01693183d51571927eb206567fc7ef',
  casdoorOrg: 'adnexus',
  casdoorApp: 'app-adnexus',
  logo: '/logos/adnexus.svg',
  favicon: '/favicons/adnexus.svg',
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
  tagline: 'Programmatic Advertising Platform',
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: false,
  enableFaceId: false,
  enableWallet: true,
  socialProviders: [
    { id: 'provider-google', type: 'google', label: 'Google' },
    { id: 'provider-apple', type: 'apple', label: 'Apple' },
    { id: 'provider-github', type: 'github', label: 'GitHub' },
    { id: 'provider-facebook', type: 'facebook', label: 'Facebook' },
  ],
  homepageUrl: 'https://ad.nexus',
  termsUrl: 'https://ad.nexus/terms-of-service',
  privacyUrl: 'https://ad.nexus/privacy-policy',
}

// AdXYZ - Crypto-native ad network (white-label of AdNexus)
export const adxyz: OrgConfig = {
  id: 'adxyz',
  name: 'adxyz',
  displayName: 'AdXYZ',
  iamUrl: 'https://id.ad.xyz',
  clientId: 'adxyz-app-client-id',
  clientSecret: 'adxyz-client-secret-placeholder',
  casdoorOrg: 'adxyz',
  casdoorApp: 'app-adxyz',
  logo: '/logos/adxyz.svg',
  favicon: '/favicons/adxyz.svg',
  theme: {
    background: '#050510',
    surface: '#0c0c18',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    text: '#ffffff',
    textMuted: '#a1a1aa',
    border: '#27272a',
    borderFocus: '#8b5cf6',
  },
  tagline: 'Crypto-Native Ad Network',
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: false,
  enableFaceId: false,
  enableWallet: true,
  socialProviders: [
    { id: 'provider-google', type: 'google', label: 'Google' },
    { id: 'provider-apple', type: 'apple', label: 'Apple' },
    { id: 'provider-github', type: 'github', label: 'GitHub' },
    { id: 'provider-facebook', type: 'facebook', label: 'Facebook' },
  ],
  homepageUrl: 'https://ad.xyz',
  termsUrl: 'https://ad.xyz/terms-of-service',
  privacyUrl: 'https://ad.xyz/privacy-policy',
}

// Export all orgs
export const organizations: Record<string, OrgConfig> = {
  hanzo,
  lux,
  pars,
  adnexus,
  adxyz,
}

// Get org config by hostname
export function getOrgByHost(host: string): OrgConfig {
  if (host.includes('lux.id')) return lux
  if (host.includes('pars.id')) return pars
  if (host.includes('ad.nexus')) return adnexus
  if (host.includes('ad.xyz')) return adxyz
  return hanzo
}
