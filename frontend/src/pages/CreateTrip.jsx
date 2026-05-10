import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card'
import { ArrowRight, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import api, { ENDPOINTS } from '../api'

export default function CreateTrip() {
  const { navigate } = useNav()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [errorMsg, setErrorMsg] = useState('')

  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [selectedCityIds, setSelectedCityIds] = useState(new Set())
  const [previewCityId, setPreviewCityId] = useState(null)
  const [cityActivities, setCityActivities] = useState({})
  const [loadingActivities, setLoadingActivities] = useState({})

  useEffect(() => {
    api.get(`${ENDPOINTS.CITIES}?limit=6&sortBy=popularity`)
      .then(r => setCities(r.data.cities))
      .catch(console.error)
      .finally(() => setLoadingCities(false))
  }, [])

  const handlePreview = async (city) => {
    if (previewCityId === city.id) { setPreviewCityId(null); return }
    setPreviewCityId(city.id)
    if (!cityActivities[city.id]) {
      setLoadingActivities(prev => ({ ...prev, [city.id]: true }))
      try {
        const r = await api.get(ENDPOINTS.CITY_ACTIVITIES(city.id))
        setCityActivities(prev => ({ ...prev, [city.id]: r.data }))
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingActivities(prev => ({ ...prev, [city.id]: false }))
      }
    }
  }

  const toggleCity = (cityId) => {
    setSelectedCityIds(prev => {
      const s = new Set(prev)
      s.has(cityId) ? s.delete(cityId) : s.add(cityId)
      return s
    })
  }

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      const res = await api.post(ENDPOINTS.TRIPS, data)
      const tripId = res.data.id

      if (selectedCityIds.size > 0) {
        const stopPromises = [...selectedCityIds].map((cityId, idx) =>
          api.post(ENDPOINTS.TRIP_STOPS(tripId), {
            cityId,
            order: idx + 1,
            arrivalDate: data.startDate,
            departureDate: data.endDate,
          })
        )
        await Promise.all(stopPromises)
      }

      navigate(`build-itinerary/${tripId}`)
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to create trip')
    }
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-(--bg-page) text-(--text-primary) font-body lg:overflow-hidden">
      <Chrome active="Plan" />

      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-(--border-subtle) shrink-0 bg-(--bg-surface)">
        <Badge variant="secondary" className="mb-2">New trip · Draft</Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Plan a new trip</h1>
        <p className="text-(--text-secondary) mt-1 text-sm sm:text-base">Start with the basics. You can refine the itinerary in the next step.</p>
      </div>

      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.6fr] lg:h-full">

          {/* LEFT — Trip details form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-(--border-subtle) space-y-4 lg:overflow-y-auto flex flex-col">
            <h2 className="font-display text-lg font-bold">Trip details</h2>
            {errorMsg && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">{errorMsg}</p>}

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
              <div className="flex flex-wrap gap-2 p-2 border border-(--border-default) rounded-md min-h-10 bg-(--bg-surface)">
                <Badge variant="secondary">Marco ×</Badge>
                <Badge variant="secondary">Iris ×</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} {...register('description')} placeholder="A slow loop through Lazio and the Amalfi coast..." />
            </div>

            {selectedCityIds.size > 0 && (
              <p className="text-xs text-(--text-secondary) bg-(--bg-muted) rounded-md px-3 py-2">
                {selectedCityIds.size} destination{selectedCityIds.size > 1 ? 's' : ''} selected — stops will be added automatically after creation.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
              <Button type="button" variant="outline" onClick={() => navigate('dashboard')} className="sm:w-auto">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={14} className="animate-spin mr-1" /> Creating...</> : <>Create Trip <ArrowRight size={14} /></>}
              </Button>
            </div>
          </form>

          {/* RIGHT — Suggested places from backend */}
          <div className="p-4 sm:p-8 lg:overflow-y-auto">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Suggested places &amp; activities</h2>
              <span className="text-xs text-(--text-tertiary)">Popular destinations</span>
            </div>

            {loadingCities ? (
              <div className="flex items-center justify-center h-40 text-(--text-tertiary)">
                <Loader2 size={20} className="animate-spin mr-2" /> Loading destinations...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => {
                  const isSelected = selectedCityIds.has(city.id)
                  const isPreviewing = previewCityId === city.id
                  const activities = cityActivities[city.id] || []
                  const isLoadingActs = loadingActivities[city.id]

                  return (
                    <Card key={city.id} className={`py-0 transition-all ${isSelected ? 'ring-2 ring-(--brand-primary)' : ''}`}>
                      <Img ratio="4/3" label={city.name} className="rounded-t-xl rounded-b-none border-0 border-b" />
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-base">{city.name}</CardTitle>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {city._count?.activities ?? 0} activities
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 text-xs mt-1">
                          {city.description || 'Explore this destination.'}
                        </CardDescription>
                      </CardHeader>

                      {isPreviewing && (
                        <CardContent className="px-4 pb-3 pt-0">
                          {isLoadingActs ? (
                            <div className="flex items-center gap-2 text-xs text-(--text-tertiary) py-2">
                              <Loader2 size={12} className="animate-spin" /> Loading activities...
                            </div>
                          ) : activities.length === 0 ? (
                            <p className="text-xs text-(--text-tertiary) italic py-1">No activities listed.</p>
                          ) : (
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {activities.map(act => (
                                <div key={act.id} className="flex justify-between items-center text-xs py-1 border-b border-(--border-subtle) last:border-0">
                                  <span className="font-medium truncate mr-2">{act.name}</span>
                                  <span className="text-(--text-tertiary) shrink-0">
                                    {act.estimatedCost === 0 ? 'Free' : `₹${act.estimatedCost}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      )}

                      <CardFooter className="p-4 pt-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handlePreview(city)}
                        >
                          {isPreviewing ? <><ChevronUp size={13} className="mr-1" /> Hide</> : <><ChevronDown size={13} className="mr-1" /> Preview</>}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => toggleCity(city.id)}
                        >
                          {isSelected ? <><Check size={13} className="mr-1" /> Added</> : '+ Add'}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
