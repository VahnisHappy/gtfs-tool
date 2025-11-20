import './App.css'
import Map from './components/Map'
import { useState } from 'react'

export default function App() {
  const [address, setAddress] = useState<{ [key: string]: string }>({
    country: '',
    state: '',
    latitude: '',
    longitude: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const searchQuery = [address.state, address.country].filter(Boolean).join(', ')

    if (!searchQuery) {
      console.log("No location provided")
      return
    }

    console.log("Searching for:", searchQuery);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json`)
      const data = await response.json()

      if (data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`Coordinates: ${lat}, ${lon}`)
        
        // Update state with new coordinates
        setAddress((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }))
      } else {
        console.error("Location not found")
      }
    } catch (error) {
      console.error("Error fetching location:", error)
    }
  }

  // Find user's current geolocation and set coordinates
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toString()
        const lon = pos.coords.longitude.toString()
        setAddress(prev => ({ ...prev, latitude: lat, longitude: lon }))
      },
      (err) => {
        console.error('Geolocation error:', err)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const resetAddress = () => {
    setAddress({
      country: '',
      state: '',
      latitude: '',
      longitude: ''
    })
  }

  return (
    <>
      {/* <form onSubmit={handleSearch} aria-label="search-form">
        <div>
          <label>
            <input
              name="state"
              value={address.state}
              onChange={handleInput}
              placeholder="e.g. San Francisco"
              style={{ marginLeft: 8 }}
            />
            <input
              name="country"
              value={address.country}
              onChange={handleInput}
              placeholder="e.g. United States"
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit">Search</button>
          <button type="button" onClick={handleLocateMe} style={{ marginLeft: 8 }}>
            Find my location
          </button>
          <button type="button" onClick={resetAddress} style={{ marginLeft: 8 }}>
            Clear
          </button>
        </div>
      </form> */}

      <Map 
        longitude={address.longitude}
        latitude={address.latitude}
        resetAddress={resetAddress} 
      />
    </>
  )
}
