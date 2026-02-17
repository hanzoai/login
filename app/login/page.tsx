'use client'

import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { getOrgByHost, type OrgConfig } from '@/config/organizations'

export default function LoginPage() {
  const [org, setOrg] = useState<OrgConfig | null>(null)

  useEffect(() => {
    const host = window.location.host
    setOrg(getOrgByHost(host))
  }, [])

  if (!org) {
    return (
      <main style={{ background: '#0a0a0f', minHeight: '100vh' }} />
    )
  }

  return (
    <main
      style={{
        background: org.theme.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <LoginForm org={org} />
    </main>
  )
}
