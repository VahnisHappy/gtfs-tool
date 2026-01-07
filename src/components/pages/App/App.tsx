import './App.css'
import Map from '../../Map'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import Sidebar from '../../organisms/Sidebar'
import Content from '../Content'
export default function App() {
  const [address, setAddress] = useState<{ [key: string]: string }>({
    country: '',
    state: '',
    latitude: '',
    longitude: ''
  })
  
  const isDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen || 
      state.appState.isRouteDetailOpen || state.appState.isCalendarDetailOpen || state.appState.isTripDetailOpen);

  const resetAddress = () => {
    setAddress({
      country: '',
      state: '',
      latitude: '',
      longitude: ''
    })
  }

  return (
    <div className="flex h-[calc(100vh-84px)]">
      <Sidebar />
      <Content />
      <div className={`flex flex-1 duration-300 ${isDetailOpen ? 'mr-[350px]' : 'mr-0'}`}>
        <Map/>
      </div>
    </div>
  )
}
