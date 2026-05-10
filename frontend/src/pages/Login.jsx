import { useNav } from '../navigation'
import Img from '../components/Img'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight } from 'lucide-react'

export default function Login() {
  const { navigate } = useNav()
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-[0.46] flex flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold">T</div>
          <span className="text-xl font-semibold tracking-tight">Traveloop</span>
        </div>

        <div className="max-w-sm w-full">
          <Badge variant="secondary" className="mb-4">Sign in</Badge>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Welcome back.</h1>
          <p className="text-muted-foreground mb-8">Pick up where you left off — your itineraries and notes are right where you left them.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="name@traveloop.io" defaultValue="amelia.stone@traveloop.io" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password</Label>
                <a className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</a>
              </div>
              <Input type="password" defaultValue="••••••••" />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked />
              Keep me signed in
            </label>
            <Button className="w-full" onClick={() => navigate('dashboard')}>
              Sign in <ArrowRight size={14} />
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              New here? <a className="text-foreground underline cursor-pointer" onClick={() => navigate('register')}>Create an account</a>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex justify-between">
          <span>© 2026 Traveloop</span><span>v1.4.0</span>
        </div>
      </div>

      <div className="flex-1 relative bg-muted">
        <Img label="Lisbon · 38.72° N" className="absolute inset-0 rounded-none border-0 border-l h-full w-full" style={{ aspectRatio: undefined }} />
        <Card className="absolute bottom-10 left-10 right-10 max-w-md rounded-xl border shadow-sm py-0">
          <CardHeader className="p-6">
            <Badge variant="accent" className="w-fit mb-2">Featured · 7 days</Badge>
            <CardTitle className="text-xl">The slow road through Iberia</CardTitle>
            <CardDescription>From Porto's wineries to Granada's old quarter — a hand-built itinerary.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
