import FormInput from './FormInput';
import FormSelectInput from './FormSelectInput';
import OptionalFieldsPanel from './OptionalFieldsPanel';

export default function RouteOptional() {
  return (
    <OptionalFieldsPanel>
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
    </OptionalFieldsPanel>
  );
}
