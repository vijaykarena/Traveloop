import {useState, useEffect} from 'react';
import Chrome from '../components/Chrome';
import TabsSwitcher from '../components/TabsSwitcher';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardTitle, CardDescription} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Calendar, Edit, Plus, X} from 'lucide-react';
import {useParams} from 'react-router-dom';
import api, {ENDPOINTS} from '../api';

export default function BuildItinerary() {
  const {id} = useParams();
  const [tab, setTab] = useState('Sections');
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add stop state
  const [isAdding, setIsAdding] = useState(false);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchTrip = async () => {
    try {
      const res = await api.get(ENDPOINTS.TRIP_BY_ID(id));
      setTrip(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (search.length >= 2) {
      api
        .get(`${ENDPOINTS.CITIES}?search=${search}`)
        .then((res) => setCities(res.data.cities))
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [search]);

  const handleAddStop = async () => {
    if (!selectedCity || !arrivalDate || !departureDate) return;
    try {
      await api.post(`${ENDPOINTS.TRIP_BY_ID(id)}/stops`, {
        cityId: selectedCity.id,
        order: trip.stops ? trip.stops.length + 1 : 1,
        arrivalDate,
        departureDate,
        notes,
      });
      setIsAdding(false);
      setSelectedCity(null);
      setArrivalDate('');
      setDepartureDate('');
      setNotes('');
      setSearch('');
      fetchTrip();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
  };

  if (loading) return <div className="p-10 text-[var(--text-secondary)]">Loading itinerary...</div>;
  if (!trip) return <div className="p-10 text-[var(--text-secondary)]">Trip not found</div>;

  const durationDays = Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />

      {/* Page Header — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">
            Itinerary builder · {durationDays} days
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{trip.title}</h1>
        </div>
        <TabsSwitcher tabs={['Sections', 'Calendar', 'Map']} active={tab} onChange={setTab} />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-8 space-y-8 flex-1 lg:overflow-y-auto relative">
        {tab === 'Sections' && (
          <div className="space-y-4">
            {trip.stops && trip.stops.map((s, idx) => (
              <Card key={s.id} className="py-0">
                <div className="flex flex-col md:grid md:grid-cols-[80px_1fr_280px]">
                  <div className="flex md:flex-col items-center gap-3 p-4 md:p-6 md:border-r border-b md:border-b-0 border-[var(--border-subtle)] justify-start md:justify-center">
                    <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] text-white grid place-items-center font-display font-bold shrink-0">{s.order || idx + 1}</div>
                    <span className="md:hidden font-display font-bold text-base">{s.city?.name}</span>
                  </div>
                  <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                    <CardTitle className="text-base hidden md:block">{s.city?.name}</CardTitle>
                    <CardDescription className="mt-2">{s.notes || s.city?.description || 'No notes added.'}</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {s.activities && s.activities.map(act => (
                        <Badge key={act.id} variant="secondary">{act.activity?.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-4 md:p-6 md:border-l border-t md:border-t-0 border-[var(--border-subtle)] space-y-3 bg-[var(--bg-muted)]/30 flex flex-row md:flex-col flex-wrap gap-4 md:gap-0 items-center md:items-start">
                    <div>
                      <Label className="text-xs text-[var(--text-tertiary)]">Date range</Label>
                      <div className="font-medium mt-1 flex items-center gap-1.5 text-sm"><Calendar size={14} /> {formatDate(s.arrivalDate)} → {formatDate(s.departureDate)}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-[var(--text-tertiary)]">Section budget</Label>
                      <div className="font-bold mt-1 text-[var(--text-tertiary)] text-lg">---</div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full md:w-full"><Edit size={14} /> Edit section</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'Calendar' && (() => {
          const start = new Date(trip.startDate.split('T')[0]);
          const end = new Date(trip.endDate.split('T')[0]);
          const days = [];
          for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            days.push(new Date(dt));
          }

          return days.map((day, idx) => {
            const dayString = day.toISOString().split('T')[0];
            const stopsToday =
              trip.stops?.filter((s) => {
                const arr = s.arrivalDate.split('T')[0];
                const dep = s.departureDate.split('T')[0];
                return dayString >= arr && dayString <= dep;
              }) || [];

            return (
              <div key={dayString} className="space-y-3">
                <h3 className="font-display font-bold text-lg text-[var(--brand-primary)]">
                  Day {idx + 1} <span className="text-[var(--text-tertiary)] font-normal text-sm ml-2">{formatDate(day)}</span>
                </h3>

                {stopsToday.length === 0 ? (
                  <div className="text-sm text-[var(--text-tertiary)] italic pl-4 border-l-2 border-[var(--border-subtle)]">
                    No stops planned for this day.
                  </div>
                ) : (
                  stopsToday.map((s) => (
                    <Card key={s.id} className="py-0">
                      <div className="flex flex-col md:grid md:grid-cols-[1fr_280px]">
                        <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                          <CardTitle className="text-base">{s.city?.name}</CardTitle>
                          <CardDescription className="mt-2">{s.notes || s.city?.description || 'No notes added.'}</CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {s.activities &&
                              s.activities.map((act) => (
                                <Badge key={act.id} variant="secondary">
                                  {act.activity?.name}
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                        <div className="p-4 md:p-6 md:border-l border-t md:border-t-0 border-[var(--border-subtle)] space-y-3 bg-[var(--bg-muted)]/30 flex flex-row md:flex-col flex-wrap gap-4 md:gap-0 items-center md:items-start">
                          <div>
                            <Label className="text-xs text-[var(--text-tertiary)]">Dates</Label>
                            <div className="font-medium mt-1 flex items-center gap-1.5 text-sm">
                              <Calendar size={14} /> {formatDate(s.arrivalDate)} → {formatDate(s.departureDate)}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full md:w-full mt-auto">
                            <Edit size={14} /> Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            );
          });
        })()}

        {!isAdding ? (
          <Button variant="outline" className="w-full h-14 border-dashed" onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-2" /> Add another section
          </Button>
        ) : (
          <Card className="p-6 border-dashed border-[var(--brand-primary)] border-2 bg-[var(--brand-primary)]/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-[var(--brand-primary)]">Add a Stop</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                <X size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 col-span-2 relative">
                <Label>Search City</Label>
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedCity(null);
                  }}
                  placeholder="e.g., Rome"
                  autoFocus
                />
                {cities.length > 0 && !selectedCity && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-[var(--border-subtle)] shadow-lg rounded-md mt-1 max-h-48 overflow-auto z-10">
                    {cities.map((city) => (
                      <div
                        key={city.id}
                        className="px-4 py-2 hover:bg-[var(--bg-muted)] cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedCity(city);
                          setSearch(city.name);
                          setCities([]);
                        }}>
                        {city.name} <span className="text-[var(--text-tertiary)] text-xs ml-2">{city.country}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCity && (
                  <div className="text-xs text-[var(--color-success)] mt-1 flex items-center gap-1">✓ Selected: {selectedCity.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Arrival Date</Label>
                <Input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min={trip.startDate.split('T')[0]}
                  max={trip.endDate.split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={arrivalDate || trip.startDate.split('T')[0]}
                  max={trip.endDate.split('T')[0]}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Notes (Optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What's the plan here?" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!selectedCity) return alert('Please select a city from the search dropdown.');
                  if (!arrivalDate) return alert('Please select an arrival date.');
                  if (!departureDate) return alert('Please select a departure date.');
                  handleAddStop();
                }}>
                Save Stop
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
