import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import StopTimeItem from './StopTimeItem';
import AutoCalculateSection from './AutoCalculateSection';

interface StopTimeData {
    arrivalTime: string;
    departureTime: string;
    stopHeadsign?: string;
    pickupType?: string;
    dropOffType?: string;
    shapeDistTraveled?: string;
    timepoint?: string;
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

interface StopSequenceItem {
    stopIndex: number;
    stopId: string;
    stopName: string;
    stopTime?: StopTimeData;
}

export default function TripStopSequence() {
    const { watch, setValue } = useFormContext();
    const stops = useSelector((state: RootState) => state.stopState?.data || []);
    
    const [calculatedTimesKey, setCalculatedTimesKey] = useState(0);
    
    const stopSequence: StopSequenceItem[] = watch('stopSequence') || [];

    const handleAddStop = () => {
        if (stops.length > 0) {
            const firstStop = stops[0];
            setValue('stopSequence', [...stopSequence, {
                stopIndex: 0,
                stopId: firstStop.id.value || '',
                stopName: firstStop.name.value || '',
                stopTime: { arrivalTime: '', departureTime: '' }
            }]);
        }
    };

    const handleCalculatedTimes = (calculatedTimes: CalculatedStopTime[]) => {
        const updatedSequence = stopSequence.map((stop) => {
            const calculated = calculatedTimes.find(ct => ct.stop_id === stop.stopId);
            if (calculated) {
                return {
                    ...stop,
                    stopTime: {
                        arrivalTime: calculated.arrival_time,
                        departureTime: calculated.departure_time,
                        shapeDistTraveled: String(Math.round(calculated.shape_dist_traveled)),
                    }
                };
            }
            return stop;
        });
        setValue('stopSequence', updatedSequence);
        setCalculatedTimesKey(prev => prev + 1);
    };

    const handleStopTimeChange = (index: number, arrivalTime: string, departureTime: string) => {
        const updatedSequence = stopSequence.map((stop, i) => {
            if (i === index) {
                return {
                    ...stop,
                    stopTime: {
                        ...stop.stopTime,
                        arrivalTime,
                        departureTime
                    }
                };
            }
            return stop;
        });
        setValue('stopSequence', updatedSequence);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">stop sequence</label>
                {stopSequence.length >= 2 && (
                <AutoCalculateSection
                    stops={stopSequence.map(s => ({ stopId: s.stopId, stopSequence: 0 }))}
                    onCalculated={handleCalculatedTimes}
                    disabled={stopSequence.length < 2}
                />
            )}
                {/* <button
                    type="button"
                    onClick={handleAddStop}
                    disabled={stops.length === 0}
                    className="text-xs px-3 py-1 bg-[#00a8e8] text-white rounded-md hover:bg-[#33BFF0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add Stop
                </button> */}
            </div>
            
            {stops.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500 text-center">No stops available</p>
                </div>
            ) : stopSequence.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500 text-center">no stops in sequence. please select route.</p>
                </div>
            ) : (
                <div className="p-2 border border-gray-300 rounded-md space-y-2">
                    <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600">search stop ({stopSequence.length} stops)</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {stopSequence.map((stop, index) => (
                            <StopTimeItem
                                key={`${stop.stopIndex}-${index}-${calculatedTimesKey}`}
                                stopId={stop.stopId}
                                stopName={stop.stopName}
                                sequence={index + 1}
                                stopTime={stop.stopTime}
                                onTimeChange={(arrival, departure) => handleStopTimeChange(index, arrival, departure)}
                            />
                        ))}
                    </div>
                </div>
                
            )}
        </div>
    );
}
