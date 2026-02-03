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
      // Redirect to IAM OAuth flow
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

  const methods: { id: AuthMethod; label: string; enabled: boolean }[] = [
    { id: 'password', label: 'Password', enabled: org.enablePasswordLogin },
    { id: 'code', label: 'Code', enabled: org.enableCodeLogin },
    { id: 'webauthn', label: 'WebAuthn', enabled: org.enableWebAuthn },
    { id: 'faceid', label: 'Face ID', enabled: org.enableFaceId },
  ].filter(m => m.enabled)

  return (
    <div
      className="login-card"
      style={{
        background: org.theme.surface,
        border: `1px solid ${org.theme.border}`,
      }}
    >
      {/* Logo */}
      <div className="logo-container">
        <img src={org.logo} alt={org.displayName} className="logo" />
        {org.tagline && (
          <p className="tagline\" style={{ color: org.theme.textMuted }}>
            {org.tagline}
          </p>
        )}
      </div>

      {/* Auth method tabs */}
      {methods.length > 1 && (
        <div className="method-tabs">
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`method-tab ${method === m.id ? 'active' : ''}`}
              style={{
                color: method === m.id ? org.theme.text : org.theme.textMuted,
                borderBottomColor: method === m.id ? org.theme.text : 'transparent',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error" style={{ color: '#ef4444' }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              background: org.theme.background,
              border: `1px solid ${org.theme.border}`,
              color: org.theme.text,
            }}
          />
        </div>

        {method === 'password' && (
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                background: org.theme.background,
                border: `1px solid ${org.theme.border}`,
                color: org.theme.text,
              }}
            />
          </div>
        )}

        {method === 'code' && (
          <div className="input-group">
            <div className="code-input-row">
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{
                  background: org.theme.background,
                  border: `1px solid ${org.theme.border}`,
                  color: org.theme.text,
                }}
              />
              <button
                type="button"
                className="send-code-btn"
                style={{
                  background: org.theme.border,
                  color: org.theme.text,
                }}
              >
                Send Code
              </button>
            </div>
          </div>
        )}

        <div className="form-options">
          <label className="checkbox-label" style={{ color: org.theme.textMuted }}>
            <input type="checkbox" defaultChecked />
            <span>Remember me</span>
          </label>
          <a
            href="/forgot-password"
            style={{ color: org.theme.textMuted }}
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
          style={{
            background: org.theme.primary,
            color: org.theme.background,
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign up link */}
      {org.enableSignup && (
        <p className="signup-link" style={{ color: org.theme.textMuted }}>
          No account?{' '}
          <a href="/signup" style={{ color: org.theme.text }}>
            Sign up
          </a>
        </p>
      )}

      <style jsx>{`
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          border-radius: 12px;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .tagline {
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .method-tabs {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid ${org.theme.border};
          padding-bottom: 0.5rem;
        }

        .method-tab {
          background: none;
          border: none;
          padding: 0.5rem 0;
          font-size: 0.875rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -0.5rem;
          transition: all 0.2s;
        }

        .error {
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          background: rgba(239, 68, 68, 0.1);
        }

        .input-group {
          margin-bottom: 1rem;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: ${org.theme.borderFocus} !important;
        }

        .code-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .code-input-row input {
          flex: 1;
        }

        .send-code-btn {
          padding: 0.875rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input {
          width: auto;
        }

        .form-options a {
          text-decoration: none;
          transition: color 0.2s;
        }

        .form-options a:hover {
          color: ${org.theme.text} !important;
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: ${org.theme.primaryHover} !important;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
        }

        .signup-link a {
          text-decoration: none;
          font-weight: 500;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
