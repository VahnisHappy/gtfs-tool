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

  const { handleSubmit, reset, watch, setValue } = methods;

  const watchedName = watch("stop_name"); 

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

  // Sync lat/lng form fields when coordinates change (from map drag or initial placement)
  useEffect(() => {
    if (
      selectedStop &&
      typeof selectedStop.lat === 'number' &&
      typeof selectedStop.lng === 'number'
    ) {
      setValue('stop_lat', selectedStop.lat);
      setValue('stop_lon', selectedStop.lng);
    }
  }, [selectedStop?.lat, selectedStop?.lng, setValue]);

  const onSubmit = async (data: StopFormData) => {
    try {
      // Clean up the payload: convert string select values to numbers, strip empty optionals
      const cleanData = {
        stop_id: data.stop_id,
        stop_name: data.stop_name,
        stop_lat: Number(data.stop_lat),
        stop_lon: Number(data.stop_lon),
        ...(data.tts_stop_name ? { tts_stop_name: data.tts_stop_name } : {}),
        ...(data.stop_code ? { stop_code: data.stop_code } : {}),
        ...(data.stop_desc ? { stop_desc: data.stop_desc } : {}),
        ...(data.zone_id ? { zone_id: data.zone_id } : {}),
        ...(data.stop_url ? { stop_url: data.stop_url } : {}),
        ...(data.location_type != null && data.location_type !== '' as unknown ? { location_type: Number(data.location_type) } : {}),
        ...(data.parent_station ? { parent_station: data.parent_station } : {}),
        ...(data.stop_timezone ? { stop_timezone: data.stop_timezone } : {}),
        ...(data.wheelchair_boarding != null && data.wheelchair_boarding !== '' as unknown ? { wheelchair_boarding: Number(data.wheelchair_boarding) } : {}),
        ...(data.level_id ? { level_id: data.level_id } : {}),
        ...(data.platform_code ? { platform_code: data.platform_code } : {}),
        ...(data.stop_access != null && data.stop_access !== '' as unknown ? { stop_access: Number(data.stop_access) } : {}),
      };

      if (selectedStop?.mode === 'new') {
        await stopsApi.create(cleanData);

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
        await stopsApi.update(data.stop_id, cleanData);

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
    // If it's a new stop that hasn't been saved, remove the placeholder by its index
    if (selectedStop?.mode === 'new' && selectedStop.stopIndex !== undefined) {
      dispatch(StopActions.removeStopByIndex(selectedStop.stopIndex));
    }
    dispatch(closeStopDetail());
  };

  return (
    <aside className={`fixed right-0 top-0 h-screen w-[350px] shadow-xl z-50 bg-[#F5F7F9] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4">
            <h3 className="text-xl font-semibold">
              {selectedStop?.mode === 'new' ? (watchedName || 'new stop') : (watchedName || 'edit Stop')}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 text-md absolute right-4 top-4"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-5">

            <div className="grid grid-cols-2 gap-3">
              <FormInput name="stop_id" label="stop id" placeholder="stop id"  rules={{ required: true }}/>
              <FormInput name="stop_name" label="stop name" placeholder="stop name" rules={{ required: true }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormNumberInput
                name="stop_lat"
                label="stop lat"
                placeholder="latitude"
                step={0.000001}
                min={-90}
                max={90}
                rules={{ required: true }}
              />
              <FormNumberInput
                name="stop_lon"
                label="stop lon"
                placeholder="longitude"
                step={0.000001}
                min={-180}
                max={180}
                rules={{ required: true }}
              />
            </div>

            <StopOptional />
          </div>

          <CancelSaveButton
            onCancel={handleCancel}
            onSave={handleSubmit(onSubmit)}
            disabled={false}
          />
        </form>
      </FormProvider>
    </aside>
  );
}