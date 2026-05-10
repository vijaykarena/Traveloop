import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ArrowRight, Plus } from 'lucide-react'

export default function CreateTrip() {
  const { navigate } = useNav()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create trip')
      }

      const trip = await res.json()
      // Navigate to dashboard after creation
      navigate('dashboard')
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />

      {/* Page Title Bar */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <Badge variant="secondary" className="mb-2">New trip · Draft</Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Plan a new trip</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">Start with the basics. You can refine the itinerary in the next step.</p>
      </div>

      {/*
        MOBILE: single scroll container, panels stack vertically
        DESKTOP: two independently scrolling panels side-by-side
      */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.6fr] lg:h-full">

          {/* ===== LEFT — Trip details form (API-connected) ===== */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] space-y-4 lg:overflow-y-auto flex flex-col">
            <h2 className="font-display text-lg font-bold">Trip details</h2>
            {errorMsg && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-[var(--radius-md)]">{errorMsg}</p>}

            <div className="space-y-2">
              <Label>Trip name</Label>
              <Input {...register('title', { required: true })} placeholder="A long weekend in Rome" />
              {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input type="date" {...register('startDate', { required: true })} />
                {errors.startDate && <span className="text-red-500 text-xs">Required</span>}
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Input type="date" {...register('endDate', { required: true })} />
                {errors.endDate && <span className="text-red-500 text-xs">Required</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              <Input {...register('destination')} placeholder="Rome, Italy" />
            </div>

            <div className="space-y-2 opacity-50 pointer-events-none">
              <Label>Companions (Coming Soon)</Label>
              <div className="flex flex-wrap gap-2 p-2 border border-[var(--border-default)] rounded-[var(--radius-md)] min-h-10 bg-[var(--bg-surface)]">
                <Badge variant="secondary">Marco ×</Badge>
                <Badge variant="secondary">Iris ×</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} {...register('description')} placeholder="A slow loop through Lazio and the Amalfi coast..." />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
              <Button type="button" variant="outline" onClick={() => navigate('dashboard')} className="sm:w-auto">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Trip'} <ArrowRight size={14} />
              </Button>
            </div>
          </form>

          {/* ===== RIGHT — Suggested places ===== */}
          <div className="p-4 sm:p-8 lg:overflow-y-auto">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Suggested places &amp; activities</h2>
              <span className="text-xs text-[var(--text-tertiary)]">Curated by region</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ['Trastevere walk', 'Rome · 3h', 'free'],
                ['Mt. Vesuvius hike', 'Naples · 1d', '€18'],
                ['Positano by ferry', 'Amalfi · ½d', '€32'],
                ['Cooking with Nonna', 'Sorrento · 4h', '€85'],
                ['Vatican at dawn', 'Rome · 3h', '€48'],
                ['Capri grottoes', 'Capri · 1d', '€54'],
              ].map(([n, m, p]) => (
                <Card key={n} className="py-0">
                  <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{n}</CardTitle>
                      <Badge variant={p === 'free' ? 'success' : 'outline'}>{p}</Badge>
                    </div>
                    <CardDescription>{m}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Preview</Button>
                    <Button size="sm" className="flex-1"><Plus size={14} /> Add</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
