import { useState } from 'react';
import SelectInput from '../atoms/SelectInput';
import NumberInput from '../atoms/NumberInput';

interface StopForCalculation {
    stopId: string;
    stopSequence: number;
}

interface CalculatedStopTime {
    stop_sequence: number;
    stop_id: string;
    stop_name: string;
    arrival_time: string;
    departure_time: string;
    shape_dist_traveled: number;
    calculated_distance_meters: number;
    calculated_travel_time_seconds: number;
}

interface AutoCalculateSectionProps {
    stops: StopForCalculation[];
    onCalculated: (times: CalculatedStopTime[]) => void;
    disabled?: boolean;
}

export default function AutoCalculateSection({
    stops,
    onCalculated,
    disabled = false
}: AutoCalculateSectionProps) {
    const [startTime, setStartTime] = useState('08:00:00');
    const [averageSpeed, setAverageSpeed] = useState(40);
    const [dwellTime, setDwellTime] = useState(30);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Generate time options (24-hour format with 15-minute intervals)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 28; hour++) { // Up to 28 hours for GTFS
            for (let minute = 0; minute < 60; minute += 15) {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
                times.push(timeStr);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const handleCalculate = async () => {
        if (stops.length < 2) {
            setError('At least 2 stops are required');
            return;
        }

        setIsCalculating(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/trips/calculate-stop-times', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stops: stops.map((stop, index) => ({
                        stop_id: stop.stopId,
                        stop_sequence: index + 1,
                    })),
                    start_time: startTime,
                    average_speed: averageSpeed,
                    speed_unit: 'kph',
                    dwell_time_seconds: dwellTime,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to calculate times');
            }

            const calculatedTimes = await response.json();
            onCalculated(calculatedTimes);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to calculate times');
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-xs px-3 py-1 bg-[#f3a80f] text-white rounded-md hover:bg-[#e69c00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="text-sm font-medium text-white">auto calculate times</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-xl w-[320px] max-h-[90vh] overflow-auto z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Auto Calculate Times</h3>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            {/* Start Time */}
                            <SelectInput
                                label="start time" value={startTime} onChange={(value) => setStartTime(String(value))}
                                options={timeOptions.map(time => ({ value: time, label: time }))}
                            />

                            {/* Average Speed */}
                            <NumberInput
                                label="average speed (km/h)"
                                value={averageSpeed}
                                onChange={setAverageSpeed}
                                min={1}
                                max={200}
                                precision={0}
                                labelClassName="text-sm font-medium"
                            />

                            {/* Dwell Time */}
                            <div>
                                <NumberInput
                                    label="dwell time (seconds)"
                                    value={dwellTime}
                                    onChange={setDwellTime}
                                    min={0}
                                    max={600}
                                    placeholder="30"
                                    precision={0}
                                    labelClassName="text-sm font-medium"
                                />
                                <p className="text-xs text-gray-500 mt-1">Time stopped at each station</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {stops.length < 2 && (
                                <p className="text-xs text-gray-500 text-center">Add at least 2 stops to calculate times</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 px-4 py-3 border-t">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleCalculate();
                                    if (!error) setIsOpen(false);
                                }}
                                disabled={disabled || isCalculating || stops.length < 2}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isCalculating ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </>
                                ) : (
                                    'Calculate'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
