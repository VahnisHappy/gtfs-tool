import FormSelectInput from "./FormSelectInput";
import FormInput from "./FormInput";
import OptionalFieldsPanel from "./OptionalFieldsPanel";

export default function TripOptional() {
    return (
        <OptionalFieldsPanel>
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
            <div>
                <FormSelectInput
                    name="carsAllowed"
                    label="cars allowed"
                    options={[
                        { value: '0', label: 'No information' },
                        { value: '1', label: 'Allowed' },
                        { value: '2', label: 'Not allowed' }
                    ]}
                    placeholder="select"
                /> 
            </div>
        </OptionalFieldsPanel>
    );
}
