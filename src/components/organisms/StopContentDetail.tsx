import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeStopDetail } from '../../store/slices/appSlice';
import type { Stop } from '../../types';
import { StopActions } from '../../store/actions';
import StopOptional from '../molecules/StopOptional';
import CancelSaveButton from '../molecules/CancelSaveButton';
import { stopsApi } from '../../services/api';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../molecules/FormInput';
import FormNumberInput from '../molecules/FormNumberInput';

interface StopFormData {
  stop_id: string,
  stop_name: string,
  stop_lat: number,
  stop_lon: number,
  tts_stop_name?: string,
  stop_code?: string,
  stop_desc?: string,
  zone_id?: string,
  stop_url?: string,
  location_type?: number,
  parent_station?: string,
  stop_timezone?: string
  wheelchair_boarding?: number,
  level_id?: string,
  platform_code?: string,
  stop_access?: number
}

export default function StopContentDetail() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
  const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
  const stops = useSelector((state: RootState) => state.stopState.data);

  const methods = useForm<StopFormData>({
    defaultValues: {
      stop_id: '',
      stop_name: '',
      stop_lat: 0,
      stop_lon: 0,
    }
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (selectedStop) {
      if (selectedStop.mode === 'edit') {
        reset({
          stop_id: selectedStop.id.value,
          stop_name: selectedStop.name.value,
          stop_lat: selectedStop.lat,
          stop_lon: selectedStop.lng,
          stop_code: selectedStop.code?.value,
          stop_desc: selectedStop.description?.value,
          // ... map the rest
        });
      } else if (selectedStop.mode === 'new') {
        reset({
          stop_id: '',
          stop_name: '',
          stop_lat: typeof selectedStop.lat === 'number' ? selectedStop.lat : 0,
          stop_lon: typeof selectedStop.lng === 'number' ? selectedStop.lng : 0
        });
      }
    }
  }, [selectedStop, reset]);

  useEffect(() => {
     if (
       selectedStop?.mode === 'new' &&
       typeof selectedStop.lat === 'number' &&
       typeof selectedStop.lng === 'number'
     ) {
       setValue('stop_lat', selectedStop.lat);
       setValue('stop_lon', selectedStop.lng);
     }
  }, [selectedStop, setValue]);

  const onSubmit = async (data: StopFormData) => {
    try {
      if (selectedStop?.mode === 'new') {
        // Data is ALREADY in the correct format! No need for 'stopToCreatePayload'
        await stopsApi.create(data); 
        
        // Update the temporary marker with proper data instead of removing it
        const lastStopIndex = stops.length - 1;
        if (lastStopIndex >= 0) {
          const savedStop: Stop = {
            id: { value: data.stop_id, error: undefined },
            name: { value: data.stop_name, error: undefined },
            lat: data.stop_lat,
            lng: data.stop_lon,
            ...(data.stop_code && { code: { value: data.stop_code, error: undefined } }),
            ...(data.stop_desc && { description: { value: data.stop_desc, error: undefined } }),
          };
          dispatch(StopActions.updateStop({ index: lastStopIndex, stop: savedStop }));
        }
      } else {
        await stopsApi.update(data.stop_id, data);
        
        // Update the stop in local state
        const stopIndex = stops.findIndex(s => s.id.value === data.stop_id);
        if (stopIndex !== -1) {
          const updatedStop: Stop = {
            id: { value: data.stop_id, error: undefined },
            name: { value: data.stop_name, error: undefined },
            lat: data.stop_lat,
            lng: data.stop_lon,
            ...(data.stop_code && { code: { value: data.stop_code, error: undefined } }),
            ...(data.stop_desc && { description: { value: data.stop_desc, error: undefined } }),
          };
          dispatch(StopActions.updateStop({ index: stopIndex, stop: updatedStop }));
        }
      }
      dispatch(closeStopDetail());
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    // If it's a new stop that hasn't been saved, remove the placeholder
    if (selectedStop?.mode === 'new') {
      dispatch(StopActions.removeLastStop());
    }
    dispatch(closeStopDetail());
  };

  return (
    <aside className={`fixed right-0 top-0 h-screen w-[350px] shadow-xl z-50 bg-[#F5F7F9] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-5">
            <h3 className="text-xl font-semibold mb-4">
              {selectedStop?.mode === 'new' ? 'New Stop' : 'Edit Stop'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <FormInput name="stop_id" label="stop id" placeholder="stop id" />
              <FormInput name="stop_name" label="stop name" placeholder="stop name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormNumberInput 
                name="stop_lat" 
                label="stop lat" 
                placeholder="latitude" 
                step={0.000001}
                min={-90}
                max={90}
              />
              <FormNumberInput 
                name="stop_lon" 
                label="stop lon" 
                placeholder="longitude"
                step={0.000001}
                min={-180}
                max={180}
              />
            </div>

            <StopOptional /> 
          </div>

          <CancelSaveButton 
             onCancel={handleCancel} 
             // FormProvider handles the submit logic via the <form> tag
             onSave={handleSubmit(onSubmit)}
             disabled={false} 
          />
        </form>
      </FormProvider>
    </aside>
  );
}