'use client'

import { useState } from 'react'
import type { OrgConfig } from '@/config/organizations'

interface LoginFormProps {
  org: OrgConfig
}

type AuthMethod = 'password' | 'code' | 'webauthn' | 'faceid'

export function LoginForm({ org }: LoginFormProps) {
  const [method, setMethod] = useState<AuthMethod>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        client_id: org.clientId,
        response_type: 'code',
        redirect_uri: `${window.location.origin}/callback`,
        scope: 'openid profile email',
        state: crypto.randomUUID(),
      })

      window.location.href = `${org.iamUrl}/login/oauth/authorize?${params}`
    } catch (err) {
      setError('Authentication failed. Please try again.')
      setLoading(false)
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
      maxWidth: '400px',
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
    signup: {
      textAlign: 'center' as const,
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: org.theme.textMuted,
    },
  }

  return (
    <div style={styles.card}>
      <div style={styles.logoContainer}>
        <img src={org.logo} alt={org.displayName} style={styles.logo} />
        {org.tagline && <p style={styles.tagline}>{org.tagline}</p>}
      </div>

      {methods.length > 1 && (
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

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        {method === 'password' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        )}

        {method === 'code' && (
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

        <div style={styles.options}>
          <label style={styles.checkbox}>
            <input type="checkbox" defaultChecked />
            <span>Remember me</span>
          </label>
          <a href="/forgot" style={styles.link}>Forgot password?</a>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {org.enableSignup && (
        <p style={styles.signup}>
          No account?{' '}
          <a href="/signup" style={{ color: org.theme.text, textDecoration: 'none' }}>
            Sign up
          </a>
        </p>
      )}
    </div>
  )
}
