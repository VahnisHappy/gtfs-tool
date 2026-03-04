import { useState } from "react";
import FormSelectInput from "./FormSelectInput";
import FormInput from "./FormInput";

export default function TripOptional() {
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
                        <FormInput name="trip_headsign" label="trip headsign" placeholder="trip headsign" />
                        <FormSelectInput
                            name="direction"
                            label="direction"
                            options={[
                                { value: '0', label: 'outbound' },
                                { value: '1', label: 'inbound' }
                            ]}
                            placeholder="select"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormInput name="block id" label="block id" placeholder="block id"/>
                        <FormInput name="shape id" label="shape id" placeholder="shape id"/>
                    </div>

                    <div>
                        <FormSelectInput
                            name="wheelchairAccessible"
                            label="wheelchair accessible"
                            options={[
                                { value: '0', label: 'No information' },
                                { value: '1', label: 'Accessible' },
                                { value: '2', label: 'Not accessible' }
                            ]}
                            placeholder="select"
                        />
                        
                    </div>
                    <div>
                        <FormSelectInput
                            name="bikesAllowed"
                            label="bikes allowed"
                            options={[
                                { value: '0', label: 'No information' },
                                { value: '1', label: 'Allowed' },
                                { value: '2', label: 'Not allowed' }
                            ]}
                            placeholder="select"
                
                        />
                    </div>
                </div>
            )}

        </div>
    );
}
