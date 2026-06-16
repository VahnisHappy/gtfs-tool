import type { MapRef, ViewState, ViewStateChangeEvent } from "react-map-gl/mapbox"
import { Map as Mapbox, NavigationControl } from "react-map-gl/mapbox"
import type { MapData } from "../../types"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import MapActions from "../../store/slices/mapSlice"
import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css'
import SearchLocation from "../molecules/SearchLocation"

export type MapDisplayProps = {
    data?: MapData,
    viewStrate?: ViewState,
    children?: React.ReactNode,
    onClick?: (event: mapboxgl.MapMouseEvent) => void,
    stops?: GeoJSON.FeatureCollection
}

export default function MapDisplay(props: MapDisplayProps) {
    const dispatch = useDispatch()
    const { accessToken, mapStyle, viewState, bounds, flyTo } = useSelector((state: RootState) => state.mapState)
    const activeAgencyId = useSelector((state: RootState) => state.agencyState.activeAgencyId)
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => props.onClick?.(e)
    const handleMove = (e: ViewStateChangeEvent) => dispatch(MapActions.actions.setViewState({ viewState: e.viewState, agencyId: activeAgencyId }))
    const mapRef = useRef<MapRef | null>(null)
    const [mapLoaded, setMapLoaded] = useState(false)


    useEffect(() => {
        const map = mapRef.current
        if (!map || !bounds) return
        map.fitBounds(bounds)
    }, [bounds])

    // Fly to location when flyTo changes
    useEffect(() => {
        const map = mapRef.current
        if (!map || !flyTo) return

        map.flyTo({
            center: [flyTo.lng, flyTo.lat],
            zoom: flyTo.zoom || 16,
            duration: 1000
        })

        // Clear flyTo after animation
        dispatch(MapActions.actions.flyToLocation(null))
    }, [flyTo])

    // Track when map is loaded
    const handleMapLoad = () => {
        console.log('Map loaded')
        setMapLoaded(true)
    }

    useEffect(() => {
        const map = mapRef.current
        if (!map || !map.isStyleLoaded()) return

        const source = map.getSource('stops') as mapboxgl.GeoJSONSource
        if (source && props.stops) {
            source.setData(props.stops)
        }
    }, [props.stops])

    const MAP_STYLES = [
        { id: 'mapbox://styles/mapbox/streets-v12', label: 'streets' },
        { id: 'mapbox://styles/mapbox/light-v11', label: 'light', },
        { id: 'mapbox://styles/mapbox/dark-v11', label: 'dark' },
    ] as const;

    return (
        <div className="w-full h-screen relative overflow-hidden">
            <Mapbox
                id="default"
                mapboxAccessToken={accessToken}
                ref={mapRef}
                mapStyle={mapStyle}
                onClick={handleMapClick}
                onMove={handleMove}
                onLoad={handleMapLoad}
                {...viewState}
            >
                {mapLoaded && (
                    <SearchLocation
                        accessToken={accessToken}
                        placeholder="Search for a location"
                        map={mapRef.current?.getMap() || null}
                    />
                )}
                <NavigationControl position="top-right" style={{ marginTop: '45px' }} />
                {props.children}
            </Mapbox>

            {/* Map style selector */}
            <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 gap-1 bg-white rounded-lg border border-gray-200 p-1 shadow-lg">
                {MAP_STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => dispatch(MapActions.actions.setMapStyle(style.id))}
                        title={style.label}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${mapStyle === style.id
                            ? 'bg-[#00A8E8] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {style.label === 'streets' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.52,99.58,32.84a8,8,0,0,0-5.52-.6l-64,16A8,8,0,0,0,24,56V200a8,8,0,0,0,9.94,7.76l61.13-15.28,61.35,30.68A8.15,8.15,0,0,0,160,224a8,8,0,0,0,1.94-.24l64-16A8,8,0,0,0,232,200V56A8,8,0,0,0,228.92,49.69ZM104,52.94l48,24V203.06l-48-24ZM40,62.25l48-12v127.5l-48,12Zm176,131.5-48,12V78.25l48-12Z"></path></svg>
                        )}
                        {style.label === 'light' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path></svg>
                        )}
                        {style.label === 'dark' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.36A88,88,0,0,1,65.64,67.09,89,89,0,0,1,81.2,40.42C75.74,76.43,90.41,114.48,122,146S179.57,180.26,215.58,174.8A89,89,0,0,1,188.9,190.36Z"></path></svg>
                        )}
                        <span>{style.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}