import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { openRouteDetail } from "../../store/slices/appSlice"
import ButtonAction from "../atoms/ButtonAction"
import RouteContentDetail from "../organisms/RouteContentDetail"

export default function RouteContent() {
    const routes = useSelector((state: RootState) => state.routeState.data)
    const dispatch = useDispatch()
    const isRouteDetailOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)

    const handleNewRoute = () => {
        dispatch(
            openRouteDetail({
                mode: 'new'
            })
        )
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