'use client'

import { useState } from 'react'
import type { OrgConfig } from '@/config/organizations'

interface LoginFormProps {
  org: OrgConfig
  mode?: 'login' | 'signup'
}

type AuthMethod = 'password' | 'code' | 'webauthn' | 'faceid'

// Ethereum provider type
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      isMetaMask?: boolean
    }
  }
}

// SVG icons for social providers
const providerIcons: Record<string, string> = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none"/><path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2"/></svg>',
}

export function LoginForm({ org, mode = 'login' }: LoginFormProps) {
  const [method, setMethod] = useState<AuthMethod>('password')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [usePhone, setUsePhone] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  // Get URL params for OAuth flow
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      redirectUri: params.get('redirect_uri') || org.homepageUrl || '/',
      clientId: params.get('client_id') || org.clientId,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { redirectUri, clientId } = getUrlParams()

    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      try {
        const resp = await fetch(`${org.iamUrl}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application: org.casdoorApp,
            organization: org.casdoorOrg,
            username: email.split('@')[0],
            name: name || email.split('@')[0],
            email: email,
            password: password,
            type: 'normal-user',
          }),
        })

        const data = await resp.json()

        if (data.status === 'error' || data.msg === 'error' || (data.data && data.data === 'error')) {
          setError(data.msg || data.data2 || 'Signup failed. Please try again.')
          setLoading(false)
          return
        }

        // Auto-login after signup
        const tokenResp = await fetch(`${org.iamUrl}/api/login/oauth/access_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: clientId,
            client_secret: org.clientSecret || '',
            username: email,
            password: password,
            scope: 'openid profile email',
          }),
        })

        const tokenData = await tokenResp.json()

        if (tokenData.access_token) {
          const sep = redirectUri.includes('?') ? '&' : '?'
          window.location.href = `${redirectUri}${sep}token=${encodeURIComponent(tokenData.access_token)}`
        } else {
          window.location.href = `/login${window.location.search}`
        }
      } catch {
        setError('Connection error. Please try again.')
        setLoading(false)
      }
      return
    }

    // Login flow — use Casdoor's login API
    const identifier = usePhone ? phone : email
    try {
      const loginResp = await fetch(`${org.iamUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: org.casdoorApp,
          organization: org.casdoorOrg,
          username: identifier,
          password: method === 'password' ? password : undefined,
          code: method === 'code' ? code : undefined,
          type: method === 'code' ? 'code' : 'login',
        }),
      })

      const loginData = await loginResp.json()

      if (loginData.status === 'error' || (loginData.msg && loginData.msg !== 'ok')) {
        setError(loginData.msg || loginData.data2 || 'Invalid credentials')
        setLoading(false)
        return
      }

      // Exchange code for token via authorization code flow
      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        state: btoa(JSON.stringify({ redirect_uri: redirectUri })),
      })
      window.location.href = `${org.iamUrl}/login/oauth/authorize?${authParams.toString()}`
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  const handleSocialLogin = (providerId: string) => {
    const { redirectUri, clientId } = getUrlParams()
    const state = btoa(JSON.stringify({ redirect_uri: redirectUri }))
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state: state,
      provider: providerId,
    })
    // Social OAuth goes through IAM backend so callback URL matches
    // what's registered with Google/GitHub/Facebook
    window.location.href = `${org.iamUrl}/login/oauth/authorize?${params.toString()}`
  }

  const handleWalletConnect = async () => {
    setWalletLoading(true)
    setError('')

    try {
      if (!window.ethereum) {
        setError('No wallet detected. Install MetaMask or another Web3 wallet.')
        setWalletLoading(false)
        return
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      if (!accounts || accounts.length === 0) {
        setError('No account selected')
        setWalletLoading(false)
        return
      }

      const address = accounts[0]
      const { redirectUri, clientId } = getUrlParams()

      // Create a sign-in message
      const nonce = Math.random().toString(36).substring(2, 15)
      const timestamp = new Date().toISOString()
      const message = [
        `Sign in to ${org.displayName}`,
        ``,
        `Wallet: ${address}`,
        `Nonce: ${nonce}`,
        `Issued At: ${timestamp}`,
      ].join('\n')

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      }) as string

      // Send to backend for verification and token exchange
      const resp = await fetch(`${org.iamUrl}/api/login/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: org.casdoorApp,
          organization: org.casdoorOrg,
          address: address,
          message: message,
          signature: signature,
          nonce: nonce,
          clientId: clientId,
        }),
      })

      const data = await resp.json()

      if (data.access_token) {
        const sep = redirectUri.includes('?') ? '&' : '?'
        window.location.href = `${redirectUri}${sep}token=${encodeURIComponent(data.access_token)}`
      } else if (data.status === 'ok' || data.msg === 'ok') {
        // Wallet linked but need to complete signup — redirect with wallet address
        const sep = redirectUri.includes('?') ? '&' : '?'
        window.location.href = `${redirectUri}${sep}wallet=${encodeURIComponent(address)}&signature=${encodeURIComponent(signature)}`
      } else {
        setError(data.msg || data.error || 'Wallet authentication failed. Try email login.')
        setWalletLoading(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      if (message.includes('User rejected') || message.includes('user rejected')) {
        setError('Wallet connection cancelled')
      } else {
        setError('Wallet connection failed. Please try again.')
      }
      setWalletLoading(false)
    }
  }

  const allMethods = [
    { id: 'password' as AuthMethod, label: 'Password', enabled: org.enablePasswordLogin },
    { id: 'code' as AuthMethod, label: 'Code', enabled: org.enableCodeLogin },
    { id: 'webauthn' as AuthMethod, label: 'WebAuthn', enabled: org.enableWebAuthn },
    { id: 'faceid' as AuthMethod, label: 'Face ID', enabled: org.enableFaceId },
  ]
  const methods = allMethods.filter(m => m.enabled)

  const styles = {
    card: {
      width: '100%',
      maxWidth: '420px',
      padding: '2.5rem',
      borderRadius: '12px',
      background: org.theme.surface,
      border: `1px solid ${org.theme.border}`,
    } as React.CSSProperties,
    logoContainer: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    logo: {
      height: '40px',
      width: 'auto',
    },
    tagline: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: org.theme.textMuted,
    },
    tabs: {
      display: 'flex',
      gap: '1.5rem',
      marginBottom: '1.5rem',
      borderBottom: `1px solid ${org.theme.border}`,
      paddingBottom: '0.5rem',
    },
    tab: (active: boolean) => ({
      background: 'none',
      border: 'none',
      padding: '0.5rem 0',
      fontSize: '0.875rem',
      cursor: 'pointer',
      color: active ? org.theme.text : org.theme.textMuted,
      borderBottom: active ? `2px solid ${org.theme.text}` : '2px solid transparent',
      marginBottom: '-0.5rem',
    } as React.CSSProperties),
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none',
      background: org.theme.background,
      border: `1px solid ${org.theme.border}`,
      color: org.theme.text,
      marginBottom: '1rem',
      boxSizing: 'border-box' as const,
    } as React.CSSProperties,
    options: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      color: org.theme.textMuted,
    },
    link: {
      color: org.theme.textMuted,
      textDecoration: 'none',
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      background: org.theme.primary,
      color: org.theme.background,
    } as React.CSSProperties,
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '1.25rem 0',
      fontSize: '0.75rem',
      color: org.theme.textMuted,
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: org.theme.border,
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      width: '100%',
      padding: '0.7rem',
      borderRadius: '8px',
      border: `1px solid ${org.theme.border}`,
      background: 'transparent',
      color: org.theme.text,
      fontSize: '0.875rem',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      transition: 'background 0.15s',
    } as React.CSSProperties,
    socialIcon: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Compact row for 2 buttons side by side
    socialRow: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    socialButtonHalf: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      flex: 1,
      padding: '0.7rem',
      borderRadius: '8px',
      border: `1px solid ${org.theme.border}`,
      background: 'transparent',
      color: org.theme.text,
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'background 0.15s',
    } as React.CSSProperties,
    footer: {
      textAlign: 'center' as const,
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: org.theme.textMuted,
    },
  }

  // Preserve query params when switching between login/signup
  const otherPageUrl = isSignup
    ? `/login${typeof window !== 'undefined' ? window.location?.search || '' : ''}`
    : `/signup${typeof window !== 'undefined' ? window.location?.search || '' : ''}`

  // Split social providers: first 2 get full-width buttons, rest go in pairs
  const providers = org.socialProviders
  const topProviders = providers.slice(0, 2)
  const bottomProviders = providers.slice(2)

  return (
    <div style={styles.card}>
      <div style={styles.logoContainer}>
        <img src={org.logo} alt={org.displayName} style={styles.logo} />
        {org.tagline && <p style={styles.tagline}>{org.tagline}</p>}
      </div>

      {/* External auth buttons — wallet first, then social */}
      {(providers.length > 0 || org.enableWallet) && (
        <>
          {/* Wallet connect — top priority */}
          {org.enableWallet && (
            <button
              onClick={handleWalletConnect}
              disabled={walletLoading}
              style={styles.socialButton}
              onMouseOver={e => (e.currentTarget.style.background = org.theme.background)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span
                style={styles.socialIcon}
                dangerouslySetInnerHTML={{ __html: providerIcons.wallet }}
              />
              {walletLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}

          {/* Social providers: full-width */}
          {topProviders.map(provider => (
            <button
              key={provider.id}
              onClick={() => handleSocialLogin(provider.id)}
              style={styles.socialButton}
              onMouseOver={e => (e.currentTarget.style.background = org.theme.background)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span
                style={styles.socialIcon}
                dangerouslySetInnerHTML={{ __html: providerIcons[provider.type] || '' }}
              />
              Continue with {provider.label}
            </button>
          ))}

          {/* Remaining providers: pairs */}
          {bottomProviders.length > 0 && (
            <div style={styles.socialRow}>
              {bottomProviders.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => handleSocialLogin(provider.id)}
                  style={styles.socialButtonHalf}
                  onMouseOver={e => (e.currentTarget.style.background = org.theme.background)}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={styles.socialIcon}
                    dangerouslySetInnerHTML={{ __html: providerIcons[provider.type] || '' }}
                  />
                  {provider.label}
                </button>
              ))}
            </div>
          )}

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span>OR CONTINUE WITH {usePhone ? 'PHONE' : 'EMAIL'}</span>
            <div style={styles.dividerLine} />
          </div>
        </>
      )}

      {/* Method tabs (only for login) */}
      {!isSignup && methods.length > 1 && (
        <div style={styles.tabs}>
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              style={styles.tab(method === m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {isSignup && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
          />
        )}

        {/* Email / Phone toggle */}
        <div style={{ position: 'relative' }}>
          {usePhone ? (
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              style={styles.input}
            />
          ) : (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          )}
          <button
            type="button"
            onClick={() => setUsePhone(!usePhone)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: org.theme.textMuted,
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {usePhone ? 'Use email' : 'Use phone'}
          </button>
        </div>

        {(method === 'password' || isSignup) && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        )}

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
        )}

        {!isSignup && method === 'code' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ ...styles.input, flex: 1, marginBottom: 0 }}
            />
            <button
              type="button"
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                background: org.theme.border,
                color: org.theme.text,
              }}
            >
              Send
            </button>
          </div>
        )}

        {!isSignup && (
          <div style={styles.options}>
            <label style={styles.checkbox}>
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="/forgot" style={styles.link}>Forgot password?</a>
          </div>
        )}

        {isSignup && org.termsUrl && (
          <p style={{ fontSize: '0.75rem', color: org.theme.textMuted, marginBottom: '1.5rem' }}>
            By creating an account, you agree to the{' '}
            <a href={org.termsUrl} target="_blank" rel="noopener" style={{ color: org.theme.text, textDecoration: 'none' }}>
              Terms of Service
            </a>
            {org.privacyUrl && (
              <>
                {' '}and{' '}
                <a href={org.privacyUrl} target="_blank" rel="noopener" style={{ color: org.theme.text, textDecoration: 'none' }}>
                  Privacy Policy
                </a>
              </>
            )}
          </p>
        )}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? (isSignup ? 'Creating account...' : 'Signing in...')
            : (isSignup ? 'Create Account' : 'Sign In')
          }
        </button>
      </form>

      <p style={styles.footer}>
        {isSignup ? (
          <>
            Already have an account?{' '}
            <a href={otherPageUrl} style={{ color: org.theme.text, textDecoration: 'none' }}>
              Sign in
            </a>
          </>
        ) : org.enableSignup ? (
          <>
            No account?{' '}
            <a href={otherPageUrl} style={{ color: org.theme.text, textDecoration: 'none' }}>
              Sign up
            </a>
          </>
        ) : null}
      </p>
    </div>
  )
}
