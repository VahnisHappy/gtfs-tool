import { useState } from 'react';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import FormInput from './FormInput';


export default function RouteOptional() {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

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
            <FormInput name="route_long_name" label="route long name" placeholder="route long name" />
            <FormInput name="route_url" label="route url" placeholder="route url" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <SelectInput 
              label="continuous pickup"
              value={continuousPickup}
              onChange={(value) => onFieldChange('continuousPickup', value)}
              placeholder="select"
            />
            <SelectInput 
              label="continuous drop off"
              value={continuousDropOff}
              onChange={(value) => onFieldChange('continuousDropOff', value)}
              placeholder="select"
            /> */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <TextInput 
              label="network id"
              value={networkId}
              onChange={(value) => onFieldChange('networkId', value)}
              placeholder="input"
            />
            <SelectInput 
              label="cemv support"
              value={cemvSupport}
              onChange={(value) => onFieldChange('cemvSupport', value)}
              placeholder="select"
            /> */}
          </div>

          {/* <TextInput 
            label="route sort order"
            value={routeSortOrder}
            onChange={(value) => onFieldChange('routeSortOrder', value)}
            placeholder="input"
          />

          <TextInput 
            label="route desc"
            value={routeDesc}
            onChange={(value) => onFieldChange('routeDesc', value)}
            placeholder="input"
          /> */}
        </div>
      )}
    </div>
  );
}
