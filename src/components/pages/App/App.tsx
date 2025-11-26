import './App.css'
import Map from '../../Map'
import { useState } from 'react'
import Sidebar from '../Sidebar'

export default function App() {
  const [address, setAddress] = useState<{ [key: string]: string }>({
    country: '',
    state: '',
    latitude: '',
    longitude: ''
  })

  const resetAddress = () => {
    setAddress({
      country: '',
      state: '',
      latitude: '',
      longitude: ''
    })
  }

  return (
    <div className="flex h-[calc(100vh-84px)] pt-3">
      {/* <Sidebar /> */}
      <Map 
        longitude={address.longitude}
        latitude={address.latitude}
        resetAddress={resetAddress} 
      />
    </div>
  )
}
