'use client'

import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { getOrgByHost, type OrgConfig, hanzo } from '@/config/organizations'

export default function LoginPage() {
  const [org, setOrg] = useState<OrgConfig>(hanzo)

  useEffect(() => {
    const host = window.location.host
    setOrg(getOrgByHost(host))
  }, [])

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
