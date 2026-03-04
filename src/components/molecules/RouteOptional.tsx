import { useState } from 'react';
import FormInput from './FormInput';
import FormSelectInput from './FormSelectInput';


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
            <FormSelectInput
              name="continuousPickup"
              label="continuous pickup"
              options={[
                { value: "0", label: "Continuous stopping pickup" },
                { value: "1", label: "No continuous stopping pickup" },
                { value: "2", label: "Must phone agency" },
                { value: "3", label: "Must coordinate with driver" }
              ]}
              placeholder="select"
            />
            <FormSelectInput
              name="continuousDropOff"
              label="continuous drop off"
              options={[
                { value: "0", label: "Continuous stopping drop off" },
                { value: "1", label: "No continuous stopping drop off" },
                { value: "2", label: "Must phone agency" },
                { value: "3", label: "Must coordinate with driver" }
              ]}
              placeholder="select"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="networkId"
              label="network id"
              placeholder="input"
            />
            <FormSelectInput
              name="cemvSupport"
              label="cemv support"
              options={[
                { value: "0", label: "No support" },
                { value: "1", label: "Supported" }
              ]}
              placeholder="select"
            />
          </div>

          <FormInput
            name="routeSortOrder"
            label="route sort order"
            placeholder="input"
          />

          <FormInput
            name="routeDesc"
            label="route desc"
            placeholder="input"
          />
        </div>
      )}
    </div>
  );
}
