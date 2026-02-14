import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { closeRouteDetail } from "../../store/slices/appSlice";
import { RouteActions } from "../../store/actions";
import TextInput from "../atoms/TextInput";
import SelectInput from "../atoms/SelectInput";
import { routeTypeOptions } from "../../data";
import ColorPicker from "../atoms/ColorPicker";
import RouteOptional from "../molecules/RotueOptional";
import CancelSaveButton from "../molecules/CancelSaveButton";
import { routeToCreatePayload, routeToUpdatePayload } from "../../services/routeMapper";
import { useState, useEffect } from "react";
import type { Route, RouteFormData } from "../../types";
import { ApiError, routesApi } from "../../services/api";

const initialRouteFormData: RouteFormData = {
    id: { value: '', error: false },
    routeName: { value: '', error: false },
    routeType: 0,
}

export default function RouteContentDetail() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen)
    const selectedRoute = useSelector((state: RootState) => state.appState.selectedRoute);
    const routes = useSelector((state: RootState) => state.routeState.data)
    const stops = useSelector((state: RootState) => state.stopState.data)

    // Local form state for managing form inputs
    const [routeFormData, setRouteFormData] = useState<RouteFormData>(initialRouteFormData);
    const [isSaving, setIsSaving] = useState(false);

    // Find the route being edited from Redux
    const editingRoute = routes.find(r => r.edit);

    // Sync Redux route state to local form state
    useEffect(() => {
        if (editingRoute) {
            setRouteFormData({
                id: editingRoute.id,
                routeName: editingRoute.name,
                routeType: editingRoute.routeType,
                routeColor: { value: editingRoute.color, error: false },
                // Initialize optional fields as needed
                routeLongName: { value: '', error: false },
                routeDesc: { value: '', error: false },
                routeUrl: { value: '', error: false },
                routeTextColor: { value: '', error: false },
                routeSortOrder: undefined,
                continuousPickup: { value: '', error: false },
                continuousDropOff: { value: '', error: false },
                networkId: { value: '', error: false },
                cemvSupport: { value: '', error: false },
            });
        }
    }, [editingRoute]);

    const handleClose = () => {
        if (selectedRoute?.mode === 'new' && selectedRoute.routeIndex !== undefined) {
            dispatch(RouteActions.removeRoute(selectedRoute.routeIndex));
        }
        dispatch(closeRouteDetail());
        setRouteFormData(initialRouteFormData); // Reset form
    }

    const handleSave = async () => {
        if (!editingRoute) return;
        if (!routeFormData.routeName?.value || !routeFormData.id?.value) return;
        if (routeFormData.routeName.value.trim() === '' || routeFormData.id.value.trim() === '') return;
        
        setIsSaving(true);
        try {
            // Create the final route object for Redux (UI state)
            const finalRoute: Route = {
                id: { value: routeFormData.id?.value ?? '', error: false },
                name: { value: routeFormData.routeName?.value ?? '', error: false },
                routeType: routeFormData.routeType,
                color: routeFormData.routeColor?.value || '#3b82f6',
                stopIndexes: editingRoute.stopIndexes,
                path: editingRoute.path,
                edit: false,
                isNew: false
            };

            if (selectedRoute?.mode === 'new') {
                // Convert form data to API payload
                const formDataForApi: RouteFormData = {
                    id: { value: routeFormData.id?.value ?? '', error: false },
                    routeName: { value: routeFormData.routeName?.value ?? '', error: false },
                    routeType: routeFormData.routeType,
                    routeColor: routeFormData.routeColor,
                    routeLongName: routeFormData.routeLongName,
                    routeDesc: routeFormData.routeDesc,
                    routeUrl: routeFormData.routeUrl,
                    routeTextColor: routeFormData.routeTextColor,
                    routeSortOrder: routeFormData.routeSortOrder,
                    continuousPickup: routeFormData.continuousPickup,
                    continuousDropOff: routeFormData.continuousDropOff,
                    networkId: routeFormData.networkId,
                    cemvSupport: routeFormData.cemvSupport,
                };
                const payload = routeToCreatePayload(formDataForApi, editingRoute.path);
                console.log('Creating route with payload:', payload);
                
                await routesApi.create(payload);
                
                // Update Redux with the saved route
                dispatch(RouteActions.updateRoute({
                    index: selectedRoute.routeIndex!, 
                    route: finalRoute
                }));

            } else if (selectedRoute?.mode === 'edit' && selectedRoute.routeIndex !== undefined) {
                // Convert form data to API payload
                const formDataForApi: RouteFormData = {
                    id: { value: routeFormData.id?.value ?? '', error: false },
                    routeName: { value: routeFormData.routeName?.value ?? '', error: false },
                    routeType: routeFormData.routeType,
                    routeColor: routeFormData.routeColor,
                    routeLongName: routeFormData.routeLongName,
                    routeDesc: routeFormData.routeDesc,
                    routeUrl: routeFormData.routeUrl,
                    routeTextColor: routeFormData.routeTextColor,
                    routeSortOrder: routeFormData.routeSortOrder,
                    continuousPickup: routeFormData.continuousPickup,
                    continuousDropOff: routeFormData.continuousDropOff,
                    networkId: routeFormData.networkId,
                    cemvSupport: routeFormData.cemvSupport,
                };
                const payload = routeToUpdatePayload(formDataForApi, editingRoute.path);
                console.log('Updating route with payload:', payload);

                await routesApi.update(routeFormData.id.value, payload);
                
                // Update Redux with the saved route
                dispatch(RouteActions.updateRoute({
                    index: selectedRoute.routeIndex,
                    route: finalRoute
                }));
            }
            
            dispatch(closeRouteDetail());
            setRouteFormData(initialRouteFormData); // Reset form

        } catch (err) {
            console.error("Failed to save route:", err);
            
            if (err instanceof ApiError) {
                console.error(`API Error: ${err.message}`);
                // TODO: Add user-facing error notification
                // e.g., dispatch(showErrorNotification(err.message))
            }
        } finally {
            setIsSaving(false);
        }
    }
    
    const handleIdChange = (value: string) => {
        setRouteFormData(prev => ({
            ...prev,
            id: { value, error: value.trim() === '' }
        }));
        dispatch(RouteActions.updateRouteId(value));
    }

    const handleNameChange = (value: string) => {
        setRouteFormData(prev => ({
            ...prev,
            routeName: { value, error: value.trim() === '' }
        }));
        dispatch(RouteActions.updateRouteName(value));
    }
    
    const handleColorChange = (color: string) => {
        setRouteFormData(prev => ({
            ...prev,
            routeColor: { value: color, error: false }
        }));
        dispatch(RouteActions.setRouteColor(color));
    }

    const handleRouteTypeChange = (value: string) => {
        const num = Number(value);
        if (!Number.isNaN(num)) {
            setRouteFormData(prev => ({
                ...prev,
                routeType: num
            }));
            dispatch(RouteActions.updateRouteType(num));
        }
    }

    const handleOptionalFieldChange = (field: string, value: string) => {
        setRouteFormData(prev => ({
            ...prev,
            [field]: { value, error: false }
        }));
        // TODO: Dispatch Redux action for optional fields if needed
    }
    
    // Validation: check if route can be saved
    const canSave = (routeFormData.routeName?.value ?? '').trim() !== '' 
        && (routeFormData.id?.value ?? '').trim() !== ''
        && !isSaving;
    
    // Get unique stops for display
    const uniqueStops = editingRoute 
        ? Array.from(new Set(editingRoute.stopIndexes))
        : [];
    
    
    const handleRemoveStop = (stopIndex: number) => {
        if (!editingRoute) return;
        dispatch(RouteActions.removeStopFromRoute(stopIndex));
    }
    return (
        <aside 
           className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {selectedRoute?.mode === 'new' 
                        ? (routeFormData.routeName.value || `new  route`) 
                        : `${routeFormData.routeName.value}(edit)`
                    }
                    </h3>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={isSaving}
                    >
                        ✕
                    </button>
                </div>
                
                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {editingRoute ? (
                        <div className="space-y-6">
                            {/* Required Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <TextInput 
                                    label="route id" 
                                    value={routeFormData.id?.value ?? ''} 
                                    onChange={handleIdChange} 
                                    placeholder="route id" 
                                    disabled={isSaving}
                                />
                                <TextInput 
                                    label="route name" 
                                    value={routeFormData.routeName?.value ?? ''} 
                                    onChange={handleNameChange} 
                                    placeholder="route name" 
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <SelectInput 
                                    label="route type"
                                    value={String(routeFormData.routeType)}
                                    onChange={handleRouteTypeChange}
                                    options={routeTypeOptions}
                                    placeholder="Select type"
                                />
                                
                                <div>
                                    <ColorPicker 
                                        color={routeFormData.routeColor?.value || '#3b82f6'} 
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>

                            {/* Optional Fields */}
                            <RouteOptional
                                routeLongName={routeFormData.routeLongName?.value || ""}
                                routeUrl={routeFormData.routeUrl?.value || ""}
                                continuousPickup={routeFormData.continuousPickup?.value || ""}
                                continuousDropOff={routeFormData.continuousDropOff?.value || ""}
                                networkId={routeFormData.networkId?.value || ""}
                                cemvSupport={routeFormData.cemvSupport?.value || ""}
                                routeSortOrder={routeFormData.routeSortOrder?.toString() || ""}
                                routeDesc={routeFormData.routeDesc?.value || ""}
                                onFieldChange={handleOptionalFieldChange}
                            />

                            {/* Stops Section */}
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium mb-2">
                                    stops ({uniqueStops.length})
                                </label>
                                
                                {uniqueStops.length > 0 ? (
                                    <div className="space-y-1 border border-gray-200 rounded-md overflow-hidden">
                                        {uniqueStops.map((stopIdx, idx) => {
                                            const stop = stops[stopIdx];
                                            return (
                                                <div
                                                        key={idx}
                                                        className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border-b last:border-b-0 group"
                                                    >
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[60px]">
                                                            {stop?.id.value || stopIdx}
                                                        </span>
                                                        <span className="text-sm flex-1">
                                                            {stop?.name.value || `Stop ${stopIdx}`}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveStop(stopIdx)}
                                                            disabled={isSaving}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                                                            title="Remove stop"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        No stops added yet. Click on the map to add stops.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No route selected</p>
                        </div>
                    )}
                </div>
                
                {/* Footer Buttons */}
                <CancelSaveButton 
                    onCancel={handleClose}
                    onSave={handleSave} 
                    disabled={!canSave}
                />
            </div>
        </aside>
    )
}