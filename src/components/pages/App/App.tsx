import './App.css'
import Map from '../../Map'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import Content from '../Content'
import { useLoadStops } from '../../../services/useLoadStops'
import { useLoadRoutes } from '../../../services/useLoadRoutes'
import { useLoadCalendars } from '../../../services/useLoadCalendars'
import { useLoadTrips } from '../../../services/useLoadTrips'

export default function App() {
  // Load stops, routes, calendars, and trips from backend on app initialization
  useLoadStops();
  useLoadRoutes();
  useLoadCalendars();
  useLoadTrips();

  const isDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen || 
      state.appState.isRouteDetailOpen || state.appState.isCalendarDetailOpen || state.appState.isTripDetailOpen);

  return (
    <div className="flex h-screen">
      <Content />
      <div className={`flex flex-1 duration-300 ${isDetailOpen ? 'mr-[350px]' : 'mr-0'}`}>
        <Map/>
      </div>
    </div>
  )
}
