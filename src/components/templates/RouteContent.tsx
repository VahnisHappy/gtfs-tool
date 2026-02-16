import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { openRouteDetail } from "../../store/slices/appSlice"
import { RouteActions, AppActions } from "../../store/actions"
import ButtonAction from "../atoms/ButtonAction"
import RouteContentDetail from "../organisms/RouteContentDetail"
import { useEffect, useRef, useState } from "react"
import EditDeleteButton from "../molecules/EditDeleteButton"
import RouteCard from "../molecules/RouteCard"
import { ApiError, routesApi } from "../../services/api"

export default function RouteContent() {
    const routes = useSelector((state: RootState) => state.routeState.data)
    const dispatch = useDispatch()
    const isRouteDetailOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
    const routeListRef = useRef<HTMLDivElement>(null);

    const handleNewRoute = () => {
        setSelectedRouteIndex(null)
        // Generate random color for new route
        const colors = ['#3b82f6'];
        const initialColor = colors[Math.floor(Math.random() * colors.length)];
        
        dispatch(RouteActions.createRoute(initialColor));
        // New route is added at the end, so its index is current routes.length
        dispatch(
            openRouteDetail({
                mode: 'new',
                routeIndex: routes.length
            })
        );
    }

    const handEditRoute = () => {
        if (selectedRouteIndex === null) return;
        const route = routes[selectedRouteIndex];
        dispatch(RouteActions.startEditingRoute(selectedRouteIndex));
        dispatch(AppActions.setMode('draw')); // Set mode to draw so stops can be added
        dispatch(openRouteDetail({
            mode: 'edit',
            ...route,
            routeIndex: selectedRouteIndex

        }))
    }

    const handleDelteRoute = async () => {
        if (selectedRouteIndex === null) return;
        
        const route = routes[selectedRouteIndex];

        if (window.confirm(`Are you sure you want to delete "route: ${route.name.value}"?`)) {
            try{
                await routesApi.delete(route.id.value)
                console.log('Route deleted from backend succesfully')

                dispatch(RouteActions.removeRoute(selectedRouteIndex));
                setSelectedRouteIndex(null);
            } catch (err) {
                console.error('Failed to delete route:', err);
                
                if (err instanceof ApiError) {
                    alert(`Failed to delete route: ${err.message}`)
                } else alert
                    ('An unexpected error occurred. Please try again.')
            }
        }
    }

    return (
        <div className="flex h-full w-full">
            <div 
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full"
                ref={routeListRef}
            >
                <div className="flex items-center gap-2 justify-between pb-2 border-b">
                        <EditDeleteButton
                            onEdit={handEditRoute}
                            onDelete={handleDelteRoute}
                            disabled={selectedRouteIndex === null}
                        />
                        <ButtonAction label="new route" onClick={handleNewRoute} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-2">
                        <h3 className="font-semibold mb-2">route list ({routes.length})</h3>
                    </div>
                    {routes.length === 0 ? (
                        <p className="text-gray-500 text-sm px-4">no route created yet. Click "New Route" and select at least 2 stops to add one.</p>
                    ) : (
                        <ul className="space-y-0">
                            {routes.map((route) => (
                                <RouteCard
                                    key={routes.indexOf(route)}
                                    route={route}
                                    index={routes.indexOf(route)}
                                    isSelected={selectedRouteIndex === routes.indexOf(route)}
                                    onSelect={() => {
                                        setSelectedRouteIndex(prevIndex => prevIndex === routes.indexOf(route) ? null : routes.indexOf(route));
                                    }}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <RouteContentDetail />
        </div>
    )
}