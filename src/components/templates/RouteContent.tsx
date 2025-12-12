import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { openRouteDetail } from "../../store/slices/appSlice"
import { RouteActions } from "../../store/actions"
import ButtonAction from "../atoms/ButtonAction"
import RouteContentDetail from "../organisms/RouteContentDetail"

export default function RouteContent() {
    const routes = useSelector((state: RootState) => state.routeState.data)
    const dispatch = useDispatch()
    const isRouteDetailOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)

    const handleNewRoute = () => {
        // Generate random color for new route
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        dispatch(RouteActions.createRoute(randomColor));
        dispatch(
            openRouteDetail({
                mode: 'new'
            })
        );
    }

    return (
        <div className="flex h-full w-full">
                    <div 
                        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
                    >
                        <div className="flex items-center p-4 border-b">
                            <ButtonAction label="New Route" onClick={handleNewRoute} />
                        </div>
                        
                    </div>
            <RouteContentDetail />
        </div>
    )
}