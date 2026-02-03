import { headers } from 'next/headers'
import { LoginForm } from '@/components/LoginForm'
import { getOrgByHost } from '@/config/organizations'

export default function LoginPage() {
  const headersList = headers()
  const host = headersList.get('host') || 'hanzo.id'
  const org = getOrgByHost(host)

  return (
    <main
      className="login-page"
      style={{ background: org.theme.background }}
    >
      <LoginForm org={org} />

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
      `}</style>
    </main>
  )
}
