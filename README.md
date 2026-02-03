# @hanzo/login

Customizable login pages for Hanzo IAM. Fork this repo to create fully branded authentication pages for your organization.

## Features

- **Fully customizable** - Complete control over look/feel, colors, logos
- **Multi-organization** - Configure multiple orgs in one deployment
- **OAuth/OIDC** - Uses Hanzo IAM SDK for secure authentication
- **Static export** - Deploy to Cloudflare Pages, Vercel, or any static host
- **Bank-grade UX** - Clean, professional, minimal design

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Configuration

Edit `config/organizations.ts` to customize your organization:

```typescript
export const myorg: OrgConfig = {
  id: 'myorg',
  name: 'myorg',
  displayName: 'My Organization',

  // IAM connection
  iamUrl: 'https://iam.hanzo.ai',
  clientId: 'myorg-client-id',

  // Branding
  logo: '/logos/myorg.svg',
  favicon: '/favicons/myorg.svg',

  // Theme - all colors customizable
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

  // Features
  enableSignup: true,
  enablePasswordLogin: true,
  enableCodeLogin: true,
  enableWebAuthn: true,
  enableFaceId: false,

  // URLs
  homepageUrl: 'https://myorg.com',
}
```

## Deployment

### Cloudflare Pages

1. Connect repo to Cloudflare Pages
2. Build command: `pnpm build`
3. Output directory: `out`

### Custom Domain

Point your Worker to the Pages deployment:

```javascript
// In your Worker
const LOGIN_ORIGIN = 'https://your-login.pages.dev';

if (pathname === '/login') {
  return fetch(`${LOGIN_ORIGIN}/login`, request);
}
```

## Organizations

Pre-configured organizations:

- **Hanzo** (`hanzo.id`) - Default
- **Lux** (`lux.id`) - Blockchain identity
- **Pars** (`pars.id`) - Persian global network

## Adding New Organizations

1. Add config in `config/organizations.ts`
2. Add logo to `public/logos/`
3. Add favicon to `public/favicons/`
4. Update `getOrgByHost()` for domain routing

## License

MIT
