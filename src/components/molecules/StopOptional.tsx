import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import FormInput from './FormInput';
import FormSelectInput from './FormSelectInput';
import { locationTypeOption, timezoneOptions, wheelchairBoardingOptions, stopAccessOptions } from '../../data';

export default function StopOptional() {
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const stops = useSelector((state: RootState) => state.stopState.data);

  // Create parent station options from existing stops (only stations - location_type = 1)
  const parentStationOptions = stops
    .filter(stop => stop.id.value) // Only stops with IDs
    .map(stop => ({
      value: stop.id.value,
      label: `${stop.id.value} - ${stop.name.value || 'Unnamed'}`
    }));

  return (
    <div className="relative w-full">
      <button
        type="button" 
        onClick={() => setShowOptionalFields(!showOptionalFields)}
        className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
      >
        <span>optional fields</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showOptionalFields && (
        <div className="absolute top-full left-0 w-full mt-2 p-4 space-y-4 border border-gray-200 rounded shadow-xl bg-white z-50">
          <div className="grid grid-cols-2 gap-3">
            {/* Look how clean this is! No props passing. */}
            <FormInput name="stop_code" label="stop code" placeholder="stop code" />
            <FormInput name="tts_stop_name" label="tts stop name" placeholder="tts stop name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="zone_id" label="zone id" placeholder="zone id" />
            <FormSelectInput 
              name="location_type" 
              label="location type" 
              options={locationTypeOption}
              placeholder="select type"
            />
          </div>

          <FormInput name="stop_desc" label="description" placeholder="description" />
          <FormInput name="stop_url" label="stop url" placeholder="stop url" />

          <div className="grid grid-cols-2 gap-3">
            <FormSelectInput 
              name="parent_station" 
              label="parent station" 
              options={parentStationOptions}
              placeholder="select station"
            />
            <FormSelectInput 
              name="stop_timezone" 
              label="stop timezone" 
              options={timezoneOptions}
              placeholder="select timezone"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormSelectInput 
              name="wheelchair_boarding" 
              label="wheelchair boarding" 
              options={wheelchairBoardingOptions}
              placeholder="select option"
              labelClassName="text-sm"
            />
            <FormSelectInput 
              name="stop_access" 
              label="stop access" 
              options={stopAccessOptions}
              placeholder="select access"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="level_id" label="level id" placeholder="level id" />
            <FormInput name="platform_code" label="platform code" placeholder="platform code" />
          </div>
        </div>
      )}
    </div>
  );
}