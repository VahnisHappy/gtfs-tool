import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { closeTripDetail } from "../../store/slices/appSlice";
import { useState, useEffect } from "react";
import TextInput from "../atoms/TextInput";
import CancelSaveButton from "../molecules/CancelSaveButton";
import StopTimeItem from "../molecules/StopTimeItem";

interface StopSequenceItem {
    stopIndex: number;
    stopId: string;
    stopName: string;
}

export default function TripContentDetail() {
    const isOpen = useSelector((state: RootState) => state.appState.isTripDetailOpen);
    const dispatch = useDispatch();

    const routes = useSelector((state: RootState) => state.routeState.data);
    const calendars = useSelector((state: RootState) => state.calendarState.data);
    const stops = useSelector((state: RootState) => state.stopState?.data || []);
    
    const routes_map = new Map(routes.map((route, index) => [index, route.id.value || "<no id>"]));
    const calendars_map = new Map(calendars.map((calendar, index) => [index, calendar.id.value || "<no id>"]));

    const [routeIndex, setRouteIndex] = useState<number>(-1);
    const [calendarIndex, setCalendarIndex] = useState<number>(-1);
    const [tripId, setTripId] = useState('');
    const [tripName, setTripName] = useState('');
    const [stopSequence, setStopSequence] = useState<StopSequenceItem[]>([]);
    const [showOptionalFields, setShowOptionalFields] = useState(false);

    // Optional fields
    const [headsign, setHeadsign] = useState('');
    const [shortName, setShortName] = useState('');
    const [direction, setDirection] = useState('');
    const [blockId, setBlockId] = useState('');
    const [wheelchairAccessible, setWheelchairAccessible] = useState('');
    const [bikesAllowed, setBikesAllowed] = useState('');

    // Auto-populate stop sequence when route is selected
    useEffect(() => {
        if (routeIndex >= 0 && routes[routeIndex]) {
            const route = routes[routeIndex];
            const sequence = route.stopIndexes.map(stopIdx => {
                const stop = stops[stopIdx];
                return {
                    stopIndex: stopIdx,
                    stopId: stop?.id.value || '',
                    stopName: stop?.name.value || ''
                };
            }).filter(item => item.stopId); // Filter out invalid stops
            
            setStopSequence(sequence);
        } else {
            setStopSequence([]);
        }
    }, [routeIndex, routes, stops]);

    const handleClose = () => {
        dispatch(closeTripDetail());
    };

    const handleRouteChange = (newRouteIndex: number) => {
        setRouteIndex(newRouteIndex);
    };

    const handleAddStop = () => {
        if (stops.length > 0) {
            const firstStop = stops[0];
            setStopSequence(prev => [...prev, {
                stopIndex: 0,
                stopId: firstStop.id.value || '',
                stopName: firstStop.name.value || ''
            }]);
        }
    };

    const handleSave = () => {
        const tripData = {
            routeIndex,
            calendarIndex,
            tripId,
            tripName,
            stopSequence: stopSequence.map(s => s.stopIndex), // Save only indices
            headsign,
            shortName,
            direction,
            blockId,
            wheelchairAccessible,
            bikesAllowed
        };
        console.log('Saving trip:', tripData);
        // TODO: Dispatch to Redux
        // dispatch(addTrip(tripData))
        dispatch(closeTripDetail());
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
                        trip name
                    </h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Route ID and Service ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">route id</label>
                            <select
                                value={routeIndex}
                                onChange={(e) => handleRouteChange(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={-1}>select</option>
                                {Array.from(routes_map.entries()).map(([index, id]) => (
                                    <option key={index} value={index}>{id}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">service id</label>
                            <select
                                value={calendarIndex}
                                onChange={(e) => setCalendarIndex(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={-1}>select</option>
                                {Array.from(calendars_map.entries()).map(([index, id]) => (
                                    <option key={index} value={index}>{id}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Trip ID and Trip Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            label="trip id"
                            value={tripId}
                            onChange={setTripId}
                            placeholder="input"
                        />
                        <TextInput
                            label="trip name"
                            value={tripName}
                            onChange={setTripName}
                            placeholder="input"
                        />
                    </div>

                    {/* Stop Sequence */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">stop sequence</label>
                            <button
                                onClick={handleAddStop}
                                disabled={stops.length === 0}
                                className="text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                + Add Stop
                            </button>
                        </div>
                        
                        {stops.length === 0 ? (
                            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-sm text-gray-500 text-center">No stops available</p>
                            </div>
                        ) : stopSequence.length === 0 ? (
                            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-sm text-gray-500 text-center">No stops in sequence. Click "Add Stop" to add.</p>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md">
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                    <span className="text-xs font-medium text-gray-600">Stop Sequence ({stopSequence.length} stops)</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {stopSequence.map((stop, index) => (
                                        <StopTimeItem
                                            key={`${stop.stopIndex}-${index}`}
                                            stopId={stop.stopId}
                                            stopName={stop.stopName}
                                            sequence={index + 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Optional Fields */}
                    <button
                        onClick={() => setShowOptionalFields(!showOptionalFields)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm font-medium">optional fields</span>
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
                        <div className="space-y-4 pt-2">
                            <TextInput
                                label="headsign"
                                value={headsign}
                                onChange={setHeadsign}
                                placeholder="input"
                            />
                            <TextInput
                                label="short name"
                                value={shortName}
                                onChange={setShortName}
                                placeholder="input"
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">direction</label>
                                <select
                                    value={direction}
                                    onChange={(e) => setDirection(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">Outbound</option>
                                    <option value="1">Inbound</option>
                                </select>
                            </div>
                            <TextInput
                                label="block id"
                                value={blockId}
                                onChange={setBlockId}
                                placeholder="input"
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">wheelchair accessible</label>
                                <select
                                    value={wheelchairAccessible}
                                    onChange={(e) => setWheelchairAccessible(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">No information</option>
                                    <option value="1">Accessible</option>
                                    <option value="2">Not accessible</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">bikes allowed</label>
                                <select
                                    value={bikesAllowed}
                                    onChange={(e) => setBikesAllowed(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">No information</option>
                                    <option value="1">Allowed</option>
                                    <option value="2">Not allowed</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <CancelSaveButton onCancel={handleClose} onSave={handleSave}/>
            </div>
        </aside>
    );
}