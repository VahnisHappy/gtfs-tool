import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { closeRouteDetail } from "../../store/slices/appSlice";

export default function RouteContentDetail() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)
    const selectedRoute = useSelector((state: RootState) => state.appState.selectedRoute)

    const handleClose = () => {
       dispatch(closeRouteDetail())
    }
    return (
        <aside 
        className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {selectedRoute?.mode === 'new' ? 'New Route' : 'Edit Route  '}
                    </h3>
                    <button onClick={handleClose} className="text-red-500">Close</button>
                </div>
            </div>
        </aside>
    )
}