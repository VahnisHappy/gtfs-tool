import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeStopDetail } from '../../store/slices/appSlice';
import type { Stop } from '../../types';
import { StopActions } from '../../store/actions';
import TextInput from '../atoms/TextInput';
import StopOptional from '../molecules/StopOptional';
import CancelSaveButton from '../molecules/CancelSaveButton';
import { stopsApi, ApiError } from '../../services/api';
import { stopToCreatePayload, stopToUpdatePayload } from '../../services/stopMapper';

// Form state uses plain strings for easier input handling
type StopFormData = {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
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
};

const initialFormData: StopFormData = {
  id: '',
  name: '',
  lat: undefined,
  lng: undefined,
  code: '',
  tlsName: '',
  zoneId: '',
  locationType: '',
  url: '',
  parentStation: '',
  timezone: '',
  wheelchairBoarding: '',
  levelId: '',
  platformCode: '',
  access: '',
  description: ''
};

export default function StopContentDetail() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
  const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
  const stops = useSelector((state: RootState) => state.stopState.data);
  
  const [stopData, setStopData] = useState<StopFormData>(initialFormData);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when selectedStop changes or when a new stop is added
  useEffect(() => {
    if (selectedStop) {
      if (selectedStop.mode === 'edit') {
        // Convert Stop type to form data
        setStopData({
          id: selectedStop.id?.value || '',
          name: selectedStop.name?.value || '',
          lat: selectedStop.lat,
          lng: selectedStop.lng,
          code: selectedStop.code?.value || '',
          tlsName: selectedStop.tlsName?.value || '',
          zoneId: selectedStop.zoneId?.value || '',
          locationType: selectedStop.locationType?.value || '',
          url: selectedStop.url?.value || '',
          parentStation: selectedStop.parentStation?.value || '',
          timezone: selectedStop.timezone?.value || '',
          wheelchairBoarding: selectedStop.wheelchairBoarding?.value || '',
          levelId: selectedStop.levelId?.value || '',
          platformCode: selectedStop.platformCode?.value || '',
          access: selectedStop.access?.value || '',
          description: selectedStop.description?.value || ''
        });
        setLatInput(selectedStop.lat?.toFixed(6) || '');
        setLngInput(selectedStop.lng?.toFixed(6) || '');
      } else if (selectedStop.mode === 'new') {
        // For new stops, get the last stop from the stops array (the one just added)
        const lastStop = stops[stops.length - 1];
        if (lastStop) {
          setStopData(prev => ({
            ...prev,
            lat: lastStop.lat,
            lng: lastStop.lng
          }));
          setLatInput(lastStop.lat.toFixed(6));
          setLngInput(lastStop.lng.toFixed(6));
        }
      }
    }
  }, [selectedStop, stops]);

  const handleLatChange = (value: string) => {
    setLatInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= -90 && numValue <= 90) {
      setStopData(prev => ({ ...prev, lat: numValue }));
      // Update the marker position in real-time
      const lastStopIndex = stops.length - 1;
      if (selectedStop?.mode === 'new' && lastStopIndex >= 0) {
        const updatedStop = { ...stops[lastStopIndex], lat: numValue };
        dispatch(StopActions.updateStop({ index: lastStopIndex, stop: updatedStop }));
      }
    }
  };

  const handleLngChange = (value: string) => {
    setLngInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= -180 && numValue <= 180) {
      setStopData(prev => ({ ...prev, lng: numValue }));
      // Update the marker position in real-time
      const lastStopIndex = stops.length - 1;
      if (selectedStop?.mode === 'new' && lastStopIndex >= 0) {
        const updatedStop = { ...stops[lastStopIndex], lng: numValue };
        dispatch(StopActions.updateStop({ index: lastStopIndex, stop: updatedStop }));
      }
    }
  };

  const handleClose = () => {
    // If it's a new stop that hasn't been saved, remove the marker
    if (selectedStop?.mode === 'new') {
      dispatch(StopActions.removeLastStop());
    }
    
    dispatch(closeStopDetail());
    setStopData(initialFormData);
    setLatInput('');
    setLngInput('');
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const stop: Stop = {
        id: { value: stopData.id, error: undefined },
        name: { value: stopData.name, error: undefined },
        lat: stopData.lat!,
        lng: stopData.lng!,
        ...(stopData.code && { code: { value: stopData.code, error: undefined } }),
        ...(stopData.tlsName && { tlsName: { value: stopData.tlsName, error: undefined } }),
        ...(stopData.zoneId && { zoneId: { value: stopData.zoneId, error: undefined } }),

        ...(stopData.locationType && { locationType: { value: stopData.locationType, error: undefined } }),
        
        ...(stopData.url && { url: { value: stopData.url, error: undefined } }),
        ...(stopData.parentStation && { parentStation: { value: stopData.parentStation, error: undefined } }),
        ...(stopData.timezone && { timezone: { value: stopData.timezone, error: undefined } }),
        
        ...(stopData.wheelchairBoarding && { wheelchairBoarding: { value: stopData.wheelchairBoarding, error: undefined } }),
        
        ...(stopData.levelId && { levelId: { value: stopData.levelId, error: undefined } }),
        ...(stopData.platformCode && { platformCode: { value: stopData.platformCode, error: undefined } }),
        ...(stopData.access && { access: { value: stopData.access, error: undefined } }),
        ...(stopData.description && { description: { value: stopData.description, error: undefined } })
      }

      if (selectedStop?.mode === 'new') {
        // Create new stop via API
        const payload = stopToCreatePayload(stop);

        console.log('Payload being sent:', payload);

        const createdStop = await stopsApi.create(payload);
        
        console.log('Stop created successfully:', createdStop);
        
        // Remove the temporary marker
        dispatch(StopActions.removeLastStop());
        // Add the complete stop to local state
        dispatch(StopActions.addStop(stop));
        
      } else if (selectedStop?.mode === 'edit') {
        // Update existing stop via API
        const payload = stopToUpdatePayload(stop);
        const updatedStop = await stopsApi.update(stopData.id, payload);
        
        console.log('Stop updated successfully:', updatedStop);
        
        // Update in local state
        const stopIndex = stops.findIndex(s => s.id.value === selectedStop.id?.value);
        if (stopIndex !== -1) {
          dispatch(StopActions.updateStop({ index: stopIndex, stop }));
        }
      }

      // Close the panel after successful save
      dispatch(closeStopDetail());
      setStopData(initialFormData);
      setLatInput('');
      setLngInput('');
      
    } catch (err) {
      console.error('Failed to save stop:', err);
      
      if (err instanceof ApiError) {
        setError(`Failed to save: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside 
      className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            {selectedStop?.mode === 'new' ? 'New Stop' : 'Edit Stop'}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Stop ID and Stop Name */}
          <div className="grid grid-cols-2 gap-3">
            <TextInput label='stop id' value={stopData.id} onChange={(value) => setStopData({...stopData, id: value})} placeholder="input"/>
            <TextInput label='stop name' value={stopData.name} onChange={(value) => setStopData({...stopData, name: value})} placeholder="input"/>
          </div>

          {/* Stop Lat and Stop Lng */}
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="stop lat" value={latInput} onChange={handleLatChange} placeholder="Click map or enter value"/>
            <TextInput label="stop lng" value={lngInput} onChange={handleLngChange} placeholder="Click map or enter value"/>
          </div>

          {/* Show instruction when in mark mode */}
          {selectedStop?.mode === 'new' && (!stopData.lat || !stopData.lng) && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700 flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>Click on the map to mark the stop location or enter coordinates manually</span>
            </div>
          )}

          {/* Show success when location is marked */}
          {stopData.lat && stopData.lng && (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Location set! Fill in the details below.</span>
            </div>
          )}

          {/* Show error message if save fails */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Optional Fields */}
          <StopOptional code={stopData.code} tlsName={stopData.tlsName}
            zoneId={stopData.zoneId} locationType={stopData.locationType}
            url={stopData.url} parentStation={stopData.parentStation}
            timezone={stopData.timezone}
            wheelchairBoarding={stopData.wheelchairBoarding}
            levelId={stopData.levelId}
            platformCode={stopData.platformCode}
            access={stopData.access}
            description={stopData.description}
            onFieldChange={(field, value) => setStopData({...stopData, [field]: value})}
          />
        </div>

        <CancelSaveButton
          onCancel={handleClose}
          onSave={handleSave}
          disabled={!stopData.lat || !stopData.lng || !stopData.id || !stopData.name || isSaving}
        />
      </div>
    </aside>
  );
}