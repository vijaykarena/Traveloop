import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NavProvider } from './navigation'
import { ThemeProvider } from './context/ThemeContext'
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
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavProvider>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Auth Flow */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Feature Pages */}
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/build-itinerary" element={<BuildItinerary />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/itinerary" element={<ItineraryView />} />
            <Route path="/community" element={<Community />} />
            <Route path="/packing" element={<Packing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/invoice" element={<Invoice />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NavProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
