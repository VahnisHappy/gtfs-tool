import { useEffect, useRef, useState } from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export type SearchLocationProps = {
  map: mapboxgl.Map | null
  accessToken: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  placeholder?: string
}

export default function SearchLocation({ 
  map, 
  accessToken, 
  placeholder = 'Search for a location' 
}: SearchLocationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const geocoderContainerRef = useRef<HTMLDivElement | null>(null)
  const geocoderRef = useRef<MapboxGeocoder | null>(null)

  useEffect(() => {
    if (!map || !geocoderContainerRef.current || geocoderRef.current) return

    const geocoder = new MapboxGeocoder({
      accessToken: accessToken,
      placeholder: placeholder,
      marker: true
    })

    geocoderContainerRef.current.appendChild(geocoder.onAdd(map))
    geocoderRef.current = geocoder

    // Close search when result is selected
    geocoder.on('result', () => {
      setIsOpen(false)
    })

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove()
        geocoderRef.current = null
      }
    }
  }, [map, accessToken, placeholder, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && geocoderContainerRef.current) {
      const input = geocoderContainerRef.current.querySelector('input')
      if (input) {
        input.focus()
      }
    }
  }, [isOpen])

  return (
    <div className="absolute top-2 z-10" style={{ right: '10px' }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white hover:bg-gray-50 text-gray-700 p-1 rounded-md shadow-md transition-colors"
          aria-label="Open search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="#000000" viewBox="0 0 256 256">
            <path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"></path>
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-md shadow-lg flex items-center gap-2 p-1">
          <div ref={geocoderContainerRef} className="flex-1" />
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 text-gray-600 p-1.5 rounded transition-colors"
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}