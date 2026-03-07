import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Modal from '../atoms/Modal';
import FormInput from '../molecules/FormInput';
import FormSelectInput from '../molecules/FormSelectInput';
import CancelSaveButton from '../molecules/CancelSaveButton';
import type { AgencyFormData, Agency } from '../../types';
import agencySlice from '../../store/slices/agencySlice';
import { timezoneOptions } from '../../data';
import { agencyApi, ApiError } from '../../services/api';

export type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const dispatch = useDispatch();
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  
  const methods = useForm<AgencyFormData>({
    defaultValues: {
      agency_id: '',
      agency_name: '',
      agency_url: '',
      agency_timezone: '',
      agency_lang: '',
      agency_phone: '',
      agency_fare_url: '',
      agency_email: '',
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: AgencyFormData) => {
    try {
      // Save to backend API
      await agencyApi.create({
        agency_id: data.agency_id,
        agency_name: data.agency_name,
        agency_url: data.agency_url,
        agency_timezone: data.agency_timezone,
        agency_lang: data.agency_lang || undefined,
        agency_phone: data.agency_phone || undefined,
        agency_fare_url: data.agency_fare_url || undefined,
        agency_email: data.agency_email || undefined,
      });

      // Transform form data to Agency type for store
      const agency: Agency = {
        id: { value: data.agency_id },
        name: { value: data.agency_name },
        url: { value: data.agency_url },
        timezone: { value: data.agency_timezone },
        ...(data.agency_lang && { lang: { value: data.agency_lang } }),
        ...(data.agency_phone && { phone: { value: data.agency_phone } }),
        ...(data.agency_fare_url && { fareUrl: { value: data.agency_fare_url } }),
        ...(data.agency_email && { email: { value: data.agency_email } }),
      };

      dispatch(agencySlice.actions.addAgency(agency));
      reset();
      onClose();
      
      // Stay on dashboard to show the created project card
      // User can click on the card to navigate to /app
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        alert(`Agency ID "${data.agency_id}" already exists. Please use a different ID.`);
      } else {
        console.error('Failed to create project:', error);
        alert('Failed to create project. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="create new project">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="agency_id" label="agency id" placeholder="e.g., agency-001"/>
                <FormInput name="agency_name" label="agency name"  placeholder="e.g., city transit"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="agency_url" label="agency URL" placeholder="https://example.com"/>
                <FormSelectInput name="agency_timezone" label="timezone" options={timezoneOptions}/>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="relative w-full mt-6 pt-4 border-t">
                <button type="button" className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
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
                            <FormInput name="agency_lang" label="language language" placeholder="e.g., en"/>
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
