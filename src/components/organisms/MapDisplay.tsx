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
    const {accessToken, mapStyle, viewState, bounds, flyTo} = useSelector((state: RootState) => state.mapState)
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => props.onClick?.(e)
    const handleMove = (e: ViewStateChangeEvent) => dispatch(MapActions.actions.setViewState(e.viewState))
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
        </div>
    )
}