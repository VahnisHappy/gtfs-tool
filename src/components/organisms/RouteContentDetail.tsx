import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import type { RootState } from "../../store";
import { closeRouteDetail } from "../../store/slices/appSlice";
import { RouteActions } from "../../store/actions";
import { routesApi, ApiError } from "../../services/api";
import { routeTypeOptions } from "../../data";
import RouteOptional from "../molecules/RouteOptional";
import RouteStopsSection from "../molecules/RouteStopsSection";
import CancelSaveButton from "../molecules/CancelSaveButton";
import FormInput from "../molecules/FormInput";
import FormSelectInput from "../molecules/FormSelectInput";
import FormColorPicker from "../molecules/FormColorPicker";

interface RouteFormData {
    route_id: string;
    route_short_name: string;
    route_type: number;
    route_color: string;
    route_desc?: string;
    route_long_name?: string;
    route_url?: string;
    route_text_color?: string;
    route_sort_order?: number;
    continuous_pickup?: string;
    continuous_drop_off?: string;
    network_id?: string;
    cemv_support?: string;
    agent_id?: string;
}

export default function RouteContentDetail() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isRouteDetailOpen);
    const selectedRoute = useSelector((state: RootState) => state.appState.selectedRoute);
    const routes = useSelector((state: RootState) => state.routeState.data);
    const stops = useSelector((state: RootState) => state.stopState.data);

    // Find the route currently being edited
    const editingRoute = routes.find(r => r.edit);
    const editingRouteRef = useRef(editingRoute);
    const isInitialMount = useRef(true);

    const methods = useForm<RouteFormData>({
        defaultValues: {
            route_id: '',
            route_short_name: '',
            route_type: 3, // Default to Bus
            route_color: '#3b82f6',
        }
    });

    const { handleSubmit, reset, watch } = methods;
    const watchedName = watch("route_short_name"); // Watch name for the header title
    const watchedColor = watch("route_color"); // Watch color for real-time map update

    // Sync color changes to Redux for real-time map update
    // Only sync user-initiated color changes, not initial form load
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        if (editingRoute && watchedColor && watchedColor !== editingRoute.color) {
            dispatch(RouteActions.setRouteColor(watchedColor));
        }
    }, [watchedColor, dispatch]);

    useEffect(() => {
        if (editingRoute) {
            // Track if this is a new route being edited
            const isNewRoute = editingRouteRef.current?.id.value !== editingRoute.id.value;
            editingRouteRef.current = editingRoute;
            
            if (isNewRoute || isInitialMount.current) {
                reset({
                    route_id: editingRoute.id.value,
                    route_short_name: editingRoute.name.value,
                    route_type: editingRoute.routeType,
                    route_color: editingRoute.color,
                });
                // Allow color sync after initial mount
                setTimeout(() => {
                    isInitialMount.current = false;
                }, 100);
            }
        } else if (selectedRoute?.mode === 'new') {
            reset({
                route_id: '',
                route_short_name: '',
                route_type: 3,
                route_color: '#3b82f6'
            });
            setTimeout(() => {
                isInitialMount.current = false;
            }, 100);
        }
    }, [editingRoute?.id.value, selectedRoute, reset]);

    const handleClose = () => {
        if (selectedRoute?.mode === 'new' && selectedRoute.routeIndex !== undefined) {
            dispatch(RouteActions.removeRoute(selectedRoute.routeIndex));
        }
        dispatch(closeRouteDetail());
    };


    const onSubmit = async (data: RouteFormData) => {
        if (!editingRoute) return;

        try {
            // Convert stopIndexes to stop IDs for saving to database
            const stopIds = editingRoute.stopIndexes
                .map(idx => stops[idx]?.id.value)
                .filter((id): id is string => !!id);

            // Ensure route_type is a number (select returns string)
            // Include route_path and route_stop_ids from editingRoute
            // Remove "#" from color for backend storage
            const apiData = {
                ...data,
                route_type: Number(data.route_type),
                route_color: data.route_color.replace('#', ''),
                route_path: editingRoute.path,
                route_stop_ids: stopIds,
            };

            if (selectedRoute?.mode === 'new') {
                await routesApi.create(apiData);

                dispatch(RouteActions.updateRoute({
                    index: selectedRoute.routeIndex!, 
                    route: {
                        id: { value: data.route_id, error: false },
                        name: { value: data.route_short_name, error: false },
                        routeType: Number(data.route_type),
                        color: data.route_color,
                        stopIndexes: editingRoute.stopIndexes,
                        stopIds: stopIds,
                        path: editingRoute.path,
                        edit: false,
                        isNew: false
                    }
                }));
            } else {
                await routesApi.update(data.route_id, apiData);

                if (selectedRoute?.routeIndex !== undefined) {
                    dispatch(RouteActions.updateRoute({
                        index: selectedRoute.routeIndex,
                        route: {
                            id: { value: data.route_id, error: false },
                            name: { value: data.route_short_name, error: false },
                            routeType: Number(data.route_type),
                            color: data.route_color,
                            stopIndexes: editingRoute.stopIndexes,
                            stopIds: stopIds,
                            path: editingRoute.path,
                            edit: false,
                            isNew: false
                        }
                    }));
                }
            }
            
            dispatch(closeRouteDetail());
        } catch (err) {
            console.error("Failed to save route:", err);
            if (err instanceof ApiError) {
                alert(`API Error: ${err.message}`);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <aside 
           className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {selectedRoute?.mode === 'new' 
                            ? (watchedName || `new route`) 
                            : `${watchedName} (edit)`
                        }
                    </h3>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        type="button"
                    >
                        ✕
                    </button>
                </div>
                
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {editingRoute ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormInput name="route_id" label="route id" placeholder="route id" />
                                        <FormInput name="route_short_name" label="route name" placeholder="route name" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormSelectInput name="route_type" label="route type" options={routeTypeOptions} placeholder="Select type"/>
                                        <FormColorPicker name="route_color" label="route color" />
                                    </div>

                                    <RouteOptional />

                                    <RouteStopsSection stopIndexes={editingRoute.stopIndexes} />
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No route selected</p>
                                </div>
                            )}
                        </div>
                        
                        {editingRoute && (
                            <CancelSaveButton 
                                onCancel={handleClose}
                                onSave={handleSubmit(onSubmit)} 
                                disabled={false} // Use RHF's loading state
                            />
                        )}
                    </form>
                </FormProvider>
            </div>
        </aside>
    );
}