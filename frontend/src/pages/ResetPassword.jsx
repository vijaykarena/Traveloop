import { useNav } from '../navigation'
import Img from '../components/Img'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
  const { navigate } = useNav()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex h-screen bg-background items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Password Reset Successfully</h1>
            <p className="text-muted-foreground text-sm">Your password has been updated. You can now sign in with your new credentials.</p>
          </div>
          <Button className="w-full" onClick={() => navigate('login')}>
            Sign in <ArrowRight size={14} />
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-[0.46] flex flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold">T</div>
          <span className="text-xl font-semibold tracking-tight">Traveloop</span>
        </div>

        <div className="max-w-sm w-full">
          <Badge variant="secondary" className="mb-4">Security</Badge>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Reset password.</h1>
          <p className="text-muted-foreground mb-8">Almost there. Choose a new, secure password for your account.</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <Button className="w-full" type="submit" disabled={loading || !token}>
              {loading ? 'Updating...' : 'Update password'} <ArrowRight size={14} />
            </Button>
          </form>
        </div>

        <div className="text-xs text-muted-foreground flex justify-between">
          <span>© 2026 Traveloop</span><span>v1.4.0</span>
        </div>
      </div>

      <div className="flex-1 relative bg-muted">
        <Img label="Douro Valley · Portugal" className="absolute inset-0 rounded-none border-0 border-l h-full w-full" style={{ aspectRatio: undefined }} />
        <Card className="absolute bottom-10 left-10 right-10 max-w-md rounded-xl border shadow-sm py-0">
          <CardHeader className="p-6">
            <Badge variant="accent" className="w-fit mb-2">Travel · Inspiration</Badge>
            <CardTitle className="text-xl">Your next adventure awaits</CardTitle>
            <CardDescription>Once you're back in, your Portugal itinerary will be waiting for you.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
