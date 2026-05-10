import Chrome from '../components/Chrome'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Plus } from 'lucide-react'

export default function Register() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="" />
      <div className="grid grid-cols-[1fr_1.4fr] flex-1 overflow-hidden">
        <div className="p-10 border-r flex flex-col justify-between overflow-auto">
          <div>
            <Badge variant="secondary" className="mb-3">Step 01 of 02</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">Create your account.</h1>
            <p className="text-muted-foreground mt-2 max-w-sm">A free account stores trips, notes, and packing lists across devices.</p>
          </div>
          <div>
            <Label className="mb-3 block">Profile photo</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full border-2 border-dashed grid place-items-center text-muted-foreground">
                <Plus size={28} />
              </div>
              <div className="text-sm text-muted-foreground max-w-[200px]">Drop a square JPG or PNG, ≥ 400×400 px.</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Already a member? <a className="text-primary cursor-pointer" onClick={() => navigate('login')}>Sign in</a>
          </div>
        </div>

        <div className="p-10 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Personal details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First name</Label><Input defaultValue="Amelia" /></div>
            <div className="space-y-2"><Label>Last name</Label><Input defaultValue="Stone" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="amelia.stone@traveloop.io" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+44 7700 900 421" /></div>
            <div className="space-y-2"><Label>City</Label><Input defaultValue="Lisbon" /></div>
            <div className="space-y-2"><Label>Country</Label><Input defaultValue="Portugal" /></div>
          </div>
          <div className="space-y-2 mt-4">
            <Label>About you</Label>
            <Textarea rows={4} defaultValue="Slow travel through small towns. Coastal walks, family-run kitchens, second-hand bookshops. Not in a rush." />
          </div>
          <div className="flex items-center justify-between mt-6">
            <Badge variant="success">Saved as draft · 14:02</Badge>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('login')}>Cancel</Button>
              <Button onClick={() => navigate('dashboard')}>Continue <ArrowRight size={14} /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
