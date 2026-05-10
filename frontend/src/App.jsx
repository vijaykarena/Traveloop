import { NavProvider, useNav } from './navigation'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import BuildItinerary from './pages/BuildItinerary'
import MyTrips from './pages/MyTrips'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ItineraryView from './pages/ItineraryView'
import Community from './pages/Community'
import Packing from './pages/Packing'
import Admin from './pages/Admin'
import Notes from './pages/Notes'
import Invoice from './pages/Invoice'

const PAGES = {
  login: Login,
  register: Register,
  dashboard: Dashboard,
  'create-trip': CreateTrip,
  'build-itinerary': BuildItinerary,
  'my-trips': MyTrips,
  profile: Profile,
  search: Search,
  itinerary: ItineraryView,
  community: Community,
  packing: Packing,
  admin: Admin,
  notes: Notes,
  invoice: Invoice,
}

function Router() {
  const { page } = useNav()
  const Page = PAGES[page] || Dashboard
  return <Page />
}

export default function App() {
  return (
    <NavProvider>
      <Router />
    </NavProvider>
  )
}
