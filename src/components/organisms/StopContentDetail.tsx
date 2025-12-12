import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeStopDetail } from '../../store/slices/appSlice';
import type { Stop } from '../../types';
import { StopActions } from '../../store/actions';

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
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');

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
  };

  const handleSave = () => {
    // Convert form data back to Stop type
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
    };

    if (selectedStop?.mode === 'new') {
      // Remove the temporary marker (which only has coordinates)
      dispatch(StopActions.removeLastStop());
      // Add the complete stop with all data
      dispatch(StopActions.addStop(stop));
    } else if (selectedStop?.mode === 'edit') {
      // Update existing stop
      const stopIndex = stops.findIndex(s => s.id.value === selectedStop.id?.value);
      if (stopIndex !== -1) {
        dispatch(StopActions.updateStop({ index: stopIndex, stop }));
      }
    }

    console.log('Saving stop:', stop);
    
    // TODO: Send to backend in the future
    // const stopGeoJSON = stopToGeoJSON(stop);
    // await fetch('/api/stops', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(stopGeoJSON)
    // });
    
    dispatch(closeStopDetail());
    setStopData(initialFormData);
    setLatInput('');
    setLngInput('');
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Stop ID and Stop Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop id</label>
              <input 
                type="text"
                value={stopData.id}
                onChange={(e) => setStopData({...stopData, id: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop name</label>
              <input 
                type="text"
                value={stopData.name}
                onChange={(e) => setStopData({...stopData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="input"
              />
            </div>
          </div>

          {/* Stop Lat and Stop Lng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop lat</label>
              <input 
                type="number"
                step="0.000001"
                value={latInput}
                onChange={(e) => handleLatChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Click map or enter value"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop lng</label>
              <input 
                type="number"
                step="0.000001"
                value={lngInput}
                onChange={(e) => handleLngChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Click map or enter value"
                min="-180"
                max="180"
              />
            </div>
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

          {/* Optional Fields Accordion */}
          <div className="border rounded">
            <button
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
              <div className="p-4 space-y-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">stop code</label>
                  <input 
                    type="text"
                    value={stopData.code || ''}
                    onChange={(e) => setStopData({...stopData, code: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">tls stop name</label>
                  <input 
                    type="text"
                    value={stopData.tlsName || ''}
                    onChange={(e) => setStopData({...stopData, tlsName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">zone id</label>
                  <input 
                    type="text"
                    value={stopData.zoneId || ''}
                    onChange={(e) => setStopData({...stopData, zoneId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">location type</label>
                  <input 
                    type="text"
                    value={stopData.locationType || ''}
                    onChange={(e) => setStopData({...stopData, locationType: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">stop url</label>
                  <input 
                    type="text"
                    value={stopData.url || ''}
                    onChange={(e) => setStopData({...stopData, url: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">parent station</label>
                  <input 
                    type="text"
                    value={stopData.parentStation || ''}
                    onChange={(e) => setStopData({...stopData, parentStation: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">stop timezone</label>
                  <input 
                    type="text"
                    value={stopData.timezone || ''}
                    onChange={(e) => setStopData({...stopData, timezone: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">wheelchair boarding</label>
                  <input 
                    type="text"
                    value={stopData.wheelchairBoarding || ''}
                    onChange={(e) => setStopData({...stopData, wheelchairBoarding: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">level id</label>
                  <input 
                    type="text"
                    value={stopData.levelId || ''}
                    onChange={(e) => setStopData({...stopData, levelId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">platform code</label>
                  <input 
                    type="text"
                    value={stopData.platformCode || ''}
                    onChange={(e) => setStopData({...stopData, platformCode: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">stop access</label>
                  <input 
                    type="text"
                    value={stopData.access || ''}
                    onChange={(e) => setStopData({...stopData, access: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">stop description</label>
                  <textarea 
                    value={stopData.description || ''}
                    onChange={(e) => setStopData({...stopData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="input"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!stopData.lat || !stopData.lng || !stopData.id || !stopData.name}
          >
            save
          </button>
        </div>
      </div>
    </aside>
  );
}