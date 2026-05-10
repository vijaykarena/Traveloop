import { useNav } from '../navigation'
import Img from '../components/Img'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPassword() {
  const { navigate } = useNav()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[var(--bg-page)]">
      <div className="flex-[0.46] flex flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--brand-primary)] text-white flex items-center justify-center font-display font-bold">T</div>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--brand-primary)]">Traveloop</span>
        </div>

        <div className="max-w-sm w-full">
          <Badge variant="secondary" className="mb-4">Security</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Forgot password?</h1>
          <p className="text-[var(--text-secondary)] mb-8">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                placeholder="name@traveloop.io" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>}
            {message && <p className="text-sm text-[var(--brand-primary)] font-medium">{message}</p>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'} <ArrowRight size={14} />
            </Button>
            
            <div className="text-sm text-[var(--text-tertiary)] text-center">
              Remembered your password? <a className="text-[var(--text-primary)] underline cursor-pointer inline-flex items-center gap-1" onClick={() => navigate('login')}><ArrowLeft size={12} /> Back to sign in</a>
            </div>
          </form>
        </div>

        <div className="text-xs text-[var(--text-tertiary)] flex justify-between">
          <span>© 2026 Traveloop</span><span>v1.4.0</span>
        </div>
      </div>

      <div className="flex-1 relative bg-[var(--bg-muted)]">
        <Img label="Alhambra · Granada" className="absolute inset-0 rounded-none border-0 border-l h-full w-full" style={{ aspectRatio: undefined }} />
        <Card className="absolute bottom-10 left-10 right-10 max-w-md py-0">
          <CardHeader className="p-6">
            <Badge variant="accent" className="w-fit mb-2">Security · Tip</Badge>
            <CardTitle className="text-xl">Protect your account</CardTitle>
            <CardDescription>Always use a unique password for Traveloop to keep your trip details safe.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
