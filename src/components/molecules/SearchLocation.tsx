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
    // Clean up when closing
    if (!isOpen) {
      if (geocoderRef.current) {
        try {
          geocoderRef.current.clear()
          if (geocoderContainerRef.current) {
            geocoderContainerRef.current.innerHTML = ''
          }
        } catch (e) {
          console.log('Cleanup error:', e)
        }
        geocoderRef.current = null
      }
      return
    }

    // Initialize when opening
    if (!map || !geocoderContainerRef.current) {
      console.log('Map or container not ready')
      return
    }

    // If geocoder already exists, don't recreate
    if (geocoderRef.current) {
      console.log('Geocoder already exists')
      return
    }

    console.log('Initializing new geocoder...')

    const geocoder = new MapboxGeocoder({
      accessToken: accessToken,
      placeholder: placeholder,
      marker: true
    })

    geocoderRef.current = geocoder

    // Clear container and add geocoder
    geocoderContainerRef.current.innerHTML = ''
    const geocoderElement = geocoder.onAdd(map)
    geocoderContainerRef.current.appendChild(geocoderElement)

    // Close search when result is selected
    geocoder.on('result', (e) => {
      console.log('Location selected:', e.result.place_name)
      setTimeout(() => {
        setIsOpen(false)
      }, 500)
    })

    geocoder.on('clear', () => {
      console.log('Geocoder cleared')
    })

    // Focus input after initialization
    requestAnimationFrame(() => {
      setTimeout(() => {
        const input = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLInputElement
        if (input) {
          input.focus()
          console.log('Input focused')
        } else {
          console.log('Input not found')
        }
      }, 150)
    })

  }, [map, accessToken, placeholder, isOpen])

  return (
    <div className="absolute top-2 right-2.5 z-[1000]">
      {!isOpen ? (
        <button
          onClick={() => {
            console.log('Opening search')
            setIsOpen(true)
          }}
          className="bg-white hover:bg-gray-50 text-gray-700 p-1 rounded-md shadow-lg transition-colors"
          aria-label="Open search"
          title="Search location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" viewBox="0 0 256 256">
            <path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"></path>
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-md shadow-lg" style={{ minWidth: '320px' }}>
          <div className="flex items-center gap-1 p-1">
            <div 
              ref={geocoderContainerRef} 
              className="flex-1 geocoder-wrapper"
            />
            <button
              onClick={() => {
                console.log('Closing search')
                setIsOpen(false)
              }}
              className="hover:bg-gray-100 text-gray-600 px-2 py-1.5 rounded transition-colors flex-shrink-0"
              aria-label="Close search"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .geocoder-wrapper .mapboxgl-ctrl-geocoder {
          width: 100%;
          max-width: none;
          box-shadow: none;
          border: none;
          background: transparent;
        }
        
        .geocoder-wrapper .mapboxgl-ctrl-geocoder--input {
          padding: 6px 30px 6px 35px;
          font-size: 14px;
          border: none;
          background: transparent;
          width: 100%;
        }
        
        .geocoder-wrapper .mapboxgl-ctrl-geocoder--input:focus {
          outline: none;
        }
        
        .geocoder-wrapper .mapboxgl-ctrl-geocoder--icon-search {
          top: 50%;
          transform: translateY(-50%);
          left: 8px;
        }
        
        .geocoder-wrapper .mapboxgl-ctrl-geocoder--icon-loading {
          top: 50%;
          transform: translateY(-50%);
          right: 8px;
        }
        
        .geocoder-wrapper .mapboxgl-ctrl-geocoder--button {
          display: none;
        }
        
        .mapboxgl-ctrl-geocoder--suggestions {
          position: absolute;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          left: 0;
          right: 0;
          margin-top: 8px;
        }
        
        .mapboxgl-ctrl-geocoder--suggestion {
          padding: 8px 12px;
          cursor: pointer;
        }
        
        .mapboxgl-ctrl-geocoder--suggestion:hover,
        .mapboxgl-ctrl-geocoder--suggestion.active {
          background-color: #f3f4f6;
        }
        
        .mapboxgl-ctrl-geocoder--suggestion-title {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }
        
        .mapboxgl-ctrl-geocoder--suggestion-address {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
      `}} />
    </div>
  )
}