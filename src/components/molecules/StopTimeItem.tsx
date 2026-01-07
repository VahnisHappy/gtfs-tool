import { useState } from 'react';

interface StopTimeData {
    arrivalTime: string;
    departureTime: string;
    stopHeadsign?: string;
    pickupType?: string;
    dropOffType?: string;
    shapeDistTraveled?: string;
    timepoint?: string;
}

interface StopSequenceItemProps {
    stopId: string;
    stopName: string;
    sequence: number;
    stopTime?: StopTimeData;
    onTimeChange?: (arrivalTime: string, departureTime: string) => void;
    onCopyTime?: () => void;
    onPasteTime?: () => void;
}

export default function StopSequenceItem({
    stopId,
    stopName,
    stopTime = { arrivalTime: '', departureTime: '' },
    onTimeChange,
    onCopyTime,
    onPasteTime
}: StopSequenceItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showOptionalFields, setShowOptionalFields] = useState(false);
    
    const [arrivalTime, setArrivalTime] = useState(stopTime.arrivalTime);
    const [departureTime, setDepartureTime] = useState(stopTime.departureTime);
    const [stopHeadsign, setStopHeadsign] = useState(stopTime.stopHeadsign || '');
    const [pickupType, setPickupType] = useState(stopTime.pickupType || '');
    const [dropOffType, setDropOffType] = useState(stopTime.dropOffType || '');
    const [shapeDistTraveled, setShapeDistTraveled] = useState(stopTime.shapeDistTraveled || '');
    const [timepoint, setTimepoint] = useState(stopTime.timepoint || '');

    const handleArrivalTimeChange = (value: string) => {
        setArrivalTime(value);
        onTimeChange?.(value, departureTime);
    };

    const handleDepartureTimeChange = (value: string) => {
        setDepartureTime(value);
        onTimeChange?.(arrivalTime, value);
    };

    // Generate time options (24-hour format with 30-minute intervals)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
                times.push(timeStr);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    return (
        <div className="border border-gray-300 rounded-md mb-3 bg-white overflow-hidden">
            {/* Stop Header - Collapsible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-base font-medium">{stopId}</span>
                    <span className="text-base text-gray-600">{stopName}</span>
                </div>
                <svg 
                    className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-200 bg-gray-50">
                    {/* Stop Time Header with Copy/Paste Actions */}
                    <div className="flex items-center justify-between pt-4">
                        <h4 className="text-base font-medium">stop time</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCopyTime?.();
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="Copy time"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPasteTime?.();
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="Paste time"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Arrival and Departure Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">arrival time</label>
                            <select
                                value={arrivalTime}
                                onChange={(e) => handleArrivalTimeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">time</option>
                                {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">departure time</label>
                            <select
                                value={departureTime}
                                onChange={(e) => handleDepartureTimeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">time</option>
                                {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Optional Fields Accordion */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptionalFields(!showOptionalFields);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
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
                            <div>
                                <label className="block text-sm font-medium mb-2">stop headsign</label>
                                <input
                                    type="text"
                                    value={stopHeadsign}
                                    onChange={(e) => setStopHeadsign(e.target.value)}
                                    placeholder="input"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">pickup type</label>
                                <select
                                    value={pickupType}
                                    onChange={(e) => setPickupType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">Regular pickup</option>
                                    <option value="1">No pickup available</option>
                                    <option value="2">Must phone agency</option>
                                    <option value="3">Must coordinate with driver</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">drop off type</label>
                                <select
                                    value={dropOffType}
                                    onChange={(e) => setDropOffType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">Regular drop off</option>
                                    <option value="1">No drop off available</option>
                                    <option value="2">Must phone agency</option>
                                    <option value="3">Must coordinate with driver</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">shape dist traveled</label>
                                <input
                                    type="text"
                                    value={shapeDistTraveled}
                                    onChange={(e) => setShapeDistTraveled(e.target.value)}
                                    placeholder="input"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">timepoint</label>
                                <select
                                    value={timepoint}
                                    onChange={(e) => setTimepoint(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">select</option>
                                    <option value="0">Times are approximate</option>
                                    <option value="1">Times are exact</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}