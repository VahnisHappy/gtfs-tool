import { useState } from 'react';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import { locationTypeOption } from '../../data';

interface StopOptionalProps {
  code?: string;
  tlsName?: string;
  zoneId?: string;
  locationType?: string;
  url?: string;
  parentStation?: string;
  timezone?: string;
  wheelchairBoarding?: string;
  levelId?: string;
  platformCode?: string;
  access?: string;
  description?: string;
  onFieldChange: (field: string, value: string) => void;
}

export default function StopOptional({
  code = '',
  tlsName = '',
  zoneId = '',
  locationType = '',
  url = '',
  parentStation = '',
  timezone = '',
  wheelchairBoarding = '',
  levelId = '',
  platformCode = '',
  access = '',
  description = '',
  onFieldChange
}: StopOptionalProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowOptionalFields(!showOptionalFields)}
        className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
      >
        <span>optional fields</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showOptionalFields && (
        <div className="absolute top-full left-0 w-full mt-2 p-4 space-y-4 border border-gray-200 rounded shadow-xl bg-white z-50">
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="stop code" value={code} onChange={(value) => onFieldChange('code', value)}
            placeholder="stop code"
            />
          
            <TextInput label="tts stop name" value={tlsName} onChange={(value) => onFieldChange('tlsName', value)}
              placeholder="tts stop name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput label="zone id" value={zoneId} onChange={(value) => onFieldChange('zoneId', value)}
            placeholder="zone id"
            />
            <SelectInput label="location type" value = {locationType} onChange={(value)=> onFieldChange('locationType', value)} options={locationTypeOption} placeholder="location type"
            />
          </div>

          <TextInput label="stop url" value={url} onChange={(value) => onFieldChange('url', value)}
            placeholder="stop url"
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectInput label="parent station" value = {parentStation} onChange={(value)=> onFieldChange('parentStation', value)} options={locationTypeOption} placeholder="parent station"
            />

            <TextInput label="stop timezone" value={timezone} onChange={(value) => onFieldChange('timezone', value)}
              placeholder="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="wheelchair boarding"
              value={wheelchairBoarding}
              onChange={(value) => onFieldChange('wheelchairBoarding', value)}
              placeholder="input"
              labelClassName="text-[12px] leading-6"
            />

            <TextInput label="level id" value={levelId} onChange={(value) => onFieldChange('levelId', value)}
              placeholder="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput label="platform code" value={platformCode} onChange={(value) => onFieldChange('platformCode', value)}
              placeholder="input"
            />

            <TextInput label="stop access" value={access} onChange={(value) => onFieldChange('access', value)}
              placeholder="input"
            />
          </div>

            <label className="block text-sm font-medium mb-2 text-gray-700">stop description</label>
            <textarea 
              value={description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="stop description"
              rows={2}
            />

        </div>
      )}
    </div>
  );
}
