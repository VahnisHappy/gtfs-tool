import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { closeRouteDetail } from "../../store/slices/appSlice";
import { RouteActions } from "../../store/actions";
import TextInput from "../atoms/TextInput";
import SelectInput from "../atoms/SelectInput";
import ButtonAction from "../atoms/ButtonAction";
import type { Route } from "../../types";
import { useEffect, useState } from "react";
import { routeTypeOptions } from "../../data";
import ColorPicker from "../atoms/ColorPicker";

export default function RouteContentDetail() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)
    const selectedRoute = useSelector((state: RootState) => state.appState.selectedRoute)
    const routes = useSelector((state: RootState) => state.routeState.data)
    const stops = useSelector((state: RootState) => state.stopState.data)

    const [showOptionalFields, setShowOptionalFields] = useState(false);

    // Find the route being edited
    const editingRoute = routes.find(r => r.edit)

    const handleClose = () => {
        if (editingRoute) {
            dispatch(RouteActions.cancelEditingRoute())
        }
        dispatch(closeRouteDetail())
    }
    
    const handleSave = () => {
        if (editingRoute && editingRoute.name.value.trim() !== '' && editingRoute.id.value.trim() !== '') {
            dispatch(RouteActions.finishEditingRoute())
            dispatch(closeRouteDetail())
        }
    }

    const handleCancel = () => {
        if (editingRoute) {
            dispatch(RouteActions.cancelEditingRoute())
        }
        dispatch(closeRouteDetail())
    }
    
    const handleIdChange = (value: string) => {
        dispatch(RouteActions.updateRouteId(value))
    }

    const handleNameChange = (value: string) => {
        dispatch(RouteActions.updateRouteName(value))
    }
    
    const handleColorChange = (color: string) => {
        dispatch(RouteActions.setRouteColor(color))
    }

    const handleRouteTypeChange = (value: string) => {
        dispatch(RouteActions.updateRouteType(value))
    }
    
    const canSave = editingRoute && editingRoute.name.value.trim() !== '' && editingRoute.id.value.trim() !== ''
    
    return (
        <aside 
           className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        Route Name
                    </h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    {editingRoute && (
                        <div className="space-y-6">
                            {/* Required Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <TextInput 
                                    label="route id" 
                                    value={editingRoute.id.value} 
                                    onChange={handleIdChange} 
                                    placeholder="input" 
                                />
                                <TextInput 
                                    label="route name" 
                                    value={editingRoute.name.value} 
                                    onChange={handleNameChange} 
                                    placeholder="input" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <SelectInput 
                                    label="route type"
                                    value={editingRoute.routeType || ''}
                                    onChange={handleRouteTypeChange}
                                    options={routeTypeOptions}
                                    placeholder="route type"
                                />
                                
                                <div>
                                    <ColorPicker 
                                        color={editingRoute.color}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>

                            {/* Optional Fields Toggle */}
                            <div className="border-t pt-4">
                                <button
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900"
                                >
                                    <span>optional fields</span>
                                    <svg
                                        className={`w-5 h-5 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showOptionalFields && (
                                    <div className="mt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextInput 
                                                label="route long name"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="input"
                                            />
                                            <TextInput 
                                                label="route url"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="input"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <SelectInput 
                                                label="continuous pickup"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="select"
                                            />
                                            <SelectInput 
                                                label="continuous drop off"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="select"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <TextInput 
                                                label="network id"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="input"
                                            />
                                            <SelectInput 
                                                label="cemv support"
                                                value=""
                                                onChange={() => {}}
                                                placeholder="select"
                                            />
                                        </div>

                                        <TextInput 
                                            label="route sort order"
                                            value=""
                                            onChange={() => {}}
                                            placeholder="input"
                                        />

                                        <TextInput 
                                            label="route desc"
                                            value=""
                                            onChange={() => {}}
                                            placeholder="input"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Stops Section */}
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium mb-2">
                                    Stops ({editingRoute.stopIndexes.length})
                                </label>
                                
                                {editingRoute.stopIndexes.length > 0 && (
                                    <div className="space-y-1 border border-gray-200 rounded-md overflow-hidden">
                                        {editingRoute.stopIndexes.map((stopIdx, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <span className="text-lg font-semibold text-gray-600">{stops[stopIdx]?.id.value || stopIdx}</span>
                                                <span className="text-lg flex-1">{stops[stopIdx]?.name.value || `Stop ${stopIdx}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                        cancel
                    </button>
                    <ButtonAction 
                        label="save"
                        onClick={handleSave}
                        disabled={!canSave}
                    />
                </div>
            </div>
        </aside>
    )
}