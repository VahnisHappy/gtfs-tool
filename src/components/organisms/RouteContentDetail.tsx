import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { closeRouteDetail } from "../../store/slices/appSlice";
import { RouteActions } from "../../store/actions";
import TextInput from "../atoms/TextInput";
import ButtonAction from "../atoms/ButtonAction";

export default function RouteContentDetail() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)
    const selectedRoute = useSelector((state: RootState) => state.appState.selectedRoute)
    const routes = useSelector((state: RootState) => state.routeState.data)
    const stops = useSelector((state: RootState) => state.stopState.data)
    
    // Find the route being edited
    const editingRoute = routes.find(r => r.edit)

    const handleClose = () => {
        if (editingRoute) {
            dispatch(RouteActions.cancelEditingRoute())
        }
        dispatch(closeRouteDetail())
    }
    
    const handleFinish = () => {
        if (editingRoute && editingRoute.name.value.trim() !== '' && editingRoute.stopIndexes.length >= 2) {
            dispatch(RouteActions.finishEditingRoute())
            dispatch(closeRouteDetail())
        }
    }
    
    const handleNameChange = (value: string) => {
        dispatch(RouteActions.updateRouteName(value))
    }
    
    const handleColorChange = (color: string) => {
        dispatch(RouteActions.updateRouteColor(color))
    }
    
    const canFinish = editingRoute && editingRoute.name.value.trim() !== '' && editingRoute.stopIndexes.length >= 2
    
    return (
        <aside 
        className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {selectedRoute?.mode === 'new' ? 'New Route' : 'Edit Route'}
                    </h3>
                    <button onClick={handleClose} className="text-red-500 hover:text-red-700">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {editingRoute && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Route Name *</label>
                                <TextInput 
                                    label="Route Name"
                                    value={editingRoute.name.value}
                                    onChange={handleNameChange}
                                    placeholder="Enter route name"
                                />
                                {editingRoute.name.error && editingRoute.name.value === '' && (
                                    <p className="text-red-500 text-sm mt-1">Route name is required</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Route Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorChange(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                editingRoute.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Stops ({editingRoute.stopIndexes.length})
                                </label>
                                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                                    {editingRoute.stopIndexes.length === 0 && (
                                        <p>Click on stops on the map to add them to this route.</p>
                                    )}
                                    {editingRoute.stopIndexes.length === 1 && (
                                        <p>Add at least one more stop to create a route.</p>
                                    )}
                                    {editingRoute.stopIndexes.length >= 2 && (
                                        <p>✓ Route has {editingRoute.stopIndexes.length} stops</p>
                                    )}
                                </div>
                                
                                {editingRoute.stopIndexes.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {editingRoute.stopIndexes.map((stopIdx, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <span className="text-xs font-medium text-gray-500">{idx + 1}</span>
                                                <span className="text-sm flex-1">{stops[stopIdx]?.name.value || `Stop ${stopIdx}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="p-4 border-t space-y-2">
                    <ButtonAction 
                        label="Finish Route"
                        onClick={handleFinish}
                        disabled={!canFinish}
                    />
                    {!canFinish && (
                        <p className="text-xs text-gray-500 text-center">
                            {!editingRoute?.name.value.trim() ? 'Enter a route name' : 'Add at least 2 stops'}
                        </p>
                    )}
                </div>
            </div>
        </aside>
    )
}