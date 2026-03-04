import { useState, useEffect } from 'react';
import TextInput from '../atoms/TextInput';
import FormInput from './FormInput';
import FormSelectInput from './FormSelectInput';

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

    // Sync local state with props when stopTime changes (e.g., from auto-calculation)
    useEffect(() => {
        if (stopTime.arrivalTime !== undefined) {
            setArrivalTime(stopTime.arrivalTime);
        }
        if (stopTime.departureTime !== undefined) {
            setDepartureTime(stopTime.departureTime);
        }
        if (stopTime.shapeDistTraveled !== undefined) {
            setShapeDistTraveled(stopTime.shapeDistTraveled);
        }
    }, [stopTime.arrivalTime, stopTime.departureTime, stopTime.shapeDistTraveled]);

    const handleArrivalTimeChange = (value: string) => {
        setArrivalTime(value);
        onTimeChange?.(value, departureTime);
    };

    const handleDepartureTimeChange = (value: string) => {
        setDepartureTime(value);
        onTimeChange?.(arrivalTime, value);
    };

    return (
        <div className="border border-gray-300 rounded-sm mb-1 bg-white overflow-hidden">
            {/* Stop Header - Collapsible */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-1 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-base font-medium truncate">{stopId}</span>
                    <span className="text-base text-gray-600 truncate">{stopName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <svg 
                        className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-2 space-y-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput 
                            label="arrival time" 
                            value={arrivalTime} 
                            onChange={handleArrivalTimeChange}
                            placeholder="HH:MM:SS" 
                            labelClassName="text-sm"
                        />
                        <TextInput 
                            label="departure time" 
                            value={departureTime} 
                            onChange={handleDepartureTimeChange}
                            placeholder="HH:MM:SS" 
                            labelClassName="text-sm"
                        />
                    </div>

                    {/* Optional Fields Accordion */}
                    <div className="relative w-full">
                        <button
                        type="button"
                        onClick={(e) => { e.stopPropagation();
                            setShowOptionalFields(!showOptionalFields);
                        }}
                        className="w-full flex items-center justify-between px-2 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
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
                            <div className="space-y-4 p-2 bg-white border border-gray-300 rounded-md mt-1">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput name="stopHeadsign" label="stop headsign" placeholder="input" labelClassName="text-sm"/>
                                    <FormSelectInput
                                        name="timepoint"
                                        label="timepoint"
                                        options={[
                                            { value: "", label: "select" },
                                            { value: "0", label: "Times are approximate" },
                                            { value: "1", label: "Times are exact" }
                                        ]}
                                        labelClassName="text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <FormSelectInput
                                        name="pickupType"
                                        label="pickup type"
                                        options={[
                                            { value: "", label: "select" },
                                            { value: "0", label: "Regular pickup" },
                                            { value: "1", label: "No pickup available" },
                                            { value: "2", label: "Must phone agency" },
                                            { value: "3", label: "Must coordinate with driver" }
                                        ]}
                                        labelClassName="text-sm"
                                    />
                                    <FormSelectInput
                                        name="dropOffType"
                                        label="drop off type"
                                        options={[
                                            { value: "", label: "select" },
                                            { value: "0", label: "Regular drop off" },
                                            { value: "1", label: "No drop off available" },
                                            { value: "2", label: "Must phone agency" },
                                            { value: "3", label: "Must coordinate with driver" }
                                        ]}
                                        labelClassName="text-sm"
                                    />
                                </div>

                                <FormInput name="shapeDistTraveled" label="shape dist traveled" placeholder="input" labelClassName="text-sm"/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}