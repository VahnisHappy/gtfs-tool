import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Modal from '../atoms/Modal';
import FormInput from '../molecules/FormInput';
import FormSelectInput from '../molecules/FormSelectInput';
import CancelSaveButton from '../molecules/CancelSaveButton';
import type { AgencyFormData, Agency } from '../../types';
import agencySlice from '../../store/slices/agencySlice';
import { AgencyActions } from '../../store/actions';
import { timezoneOptions } from '../../data';
import { agencyApi, ApiError } from '../../services/api';

export type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Pass an existing agency to edit. Omit for create mode. */
  agency?: Agency;
};

export default function ProjectModal({ isOpen, onClose, agency }: ProjectModalProps) {
  const dispatch = useDispatch();
  const isEdit = !!agency;

  const hasOptionalData = isEdit && !!(agency.lang?.value || agency.phone?.value || agency.fareUrl?.value || agency.email?.value);
  const [showOptionalFields, setShowOptionalFields] = useState(hasOptionalData);

  const methods = useForm<AgencyFormData>({
    defaultValues: {
      agency_id: agency?.id.value ?? '',
      agency_name: agency?.name.value ?? '',
      agency_url: agency?.url.value ?? '',
      agency_timezone: agency?.timezone.value ?? '',
      agency_lang: agency?.lang?.value ?? '',
      agency_phone: agency?.phone?.value ?? '',
      agency_fare_url: agency?.fareUrl?.value ?? '',
      agency_email: agency?.email?.value ?? '',
    },
  });

  const { handleSubmit, reset } = methods;

  const toAgency = (data: AgencyFormData): Agency => ({
    id: { value: data.agency_id },
    name: { value: data.agency_name },
    url: { value: data.agency_url },
    timezone: { value: data.agency_timezone },
    ...(data.agency_lang && { lang: { value: data.agency_lang } }),
    ...(data.agency_phone && { phone: { value: data.agency_phone } }),
    ...(data.agency_fare_url && { fareUrl: { value: data.agency_fare_url } }),
    ...(data.agency_email && { email: { value: data.agency_email } }),
  });

  const toPayload = (data: AgencyFormData) => ({
    agency_id: data.agency_id,
    agency_name: data.agency_name,
    agency_url: data.agency_url,
    agency_timezone: data.agency_timezone,
    agency_lang: data.agency_lang || undefined,
    agency_phone: data.agency_phone || undefined,
    agency_fare_url: data.agency_fare_url || undefined,
    agency_email: data.agency_email || undefined,
  });

  const onSubmit = async (data: AgencyFormData) => {
    try {
      if (isEdit) {
        await agencyApi.update(agency.id.value, toPayload(data));
        dispatch(AgencyActions.updateAgency({ id: agency.id.value, data: toAgency(data) }));
      } else {
        await agencyApi.create(toPayload(data));
        dispatch(agencySlice.actions.addAgency(toAgency(data)));
      }
      reset();
      onClose();
    } catch (error) {
      if (!isEdit && error instanceof ApiError && error.status === 409) {
        alert(`Agency ID "${data.agency_id}" already exists. Please use a different ID.`);
      } else {
        console.error(`Failed to ${isEdit ? 'update' : 'create'} project:`, error);
        alert(`Failed to ${isEdit ? 'update' : 'create'} project. Please try again.`);
      }
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'edit project' : 'create new project'}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="agency_id" label="agency id" placeholder="e.g., agency-001" rules={{ required: true }} disabled={isEdit}/>
                <FormInput name="agency_name" label="agency name" placeholder="e.g., city transit" rules={{ required: true }}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="agency_url" label="agency URL" placeholder="https://example.com" rules={{ required: true }}/>
                <FormSelectInput name="agency_timezone" label="timezone" options={timezoneOptions} rules={{ required: true }} searchable/>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="relative w-full mt-6 pt-4 border-t border-gray-300">
                <button type="button" className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                >
                    <span>optional fields</span>
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
                    <div className="absolute top-full left-0 w-full mt-2 p-4 space-y-4 border border-gray-200 rounded shadow-xl bg-white z-50">
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput name="agency_lang" label="language" placeholder="e.g., en"/>
                            <FormInput name="agency_phone" label="phone" placeholder="e.g., +1-555-1234"/>
                        </div>

                        <div>
                            <FormInput name="agency_fare_url" label="fare URL" placeholder="https://example.com/fares"/>
                            <FormInput name="agency_email" label="email" placeholder="e.g., info@example.com"/>
                            <FormInput name="cemv_support" label="cemv support" placeholder="e.g., support@example.com"/>
                        </div>
                    </div>
                )}
            </div>
            
          </div>

            <div className="mt-6">
                <CancelSaveButton onCancel={handleCancel} onSave={handleSubmit(onSubmit)}/>
            </div>

        </form>
      </FormProvider>
    </Modal>
  );
}
