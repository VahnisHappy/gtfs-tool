import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeStopDetail } from '../../store/slices/appSlice';

export default function StopContentDetail() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
  const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
  
  const [stopData, setStopData] = useState({
    stopId: '',
    stopName: '',
    stopLat: '',
    stopLng: '',
    stopCode: '',
    tlsStopName: '',
    zoneId: '',
    locationType: '',
    stopUrl: '',
    parentStation: '',
    stopTimezone: '',
    wheelchairBoarding: '',
    levelId: '',
    platformCode: '',
    stopAccess: '',
    stopDescription: ''
  });

  const [showOptionalFields, setShowOptionalFields] = useState(false);

  useEffect(() => {
    if (selectedStop) {
      setStopData(prev => ({
        ...prev,
        stopLat: selectedStop.lat ? selectedStop.lat.toFixed(6) : '',
        stopLng: selectedStop.lng ? selectedStop.lng.toFixed(6) : '',
        ...(selectedStop.mode === 'edit' ? {
          stopId: selectedStop.stopId || '',
          stopName: selectedStop.stopName || '',
          stopCode: selectedStop.stopCode || '',
          tlsStopName: selectedStop.tlsStopName || '',
          zoneId: selectedStop.zoneId || '',
          locationType: selectedStop.locationType || '',
          stopUrl: selectedStop.stopUrl || '',
          parentStation: selectedStop.parentStation || '',
          stopTimezone: selectedStop.stopTimezone || '',
          wheelchairBoarding: selectedStop.wheelchairBoarding || '',
          levelId: selectedStop.levelId || '',
          platformCode: selectedStop.platformCode || '',
          stopAccess: selectedStop.stopAccess || '',
          stopDescription: selectedStop.stopDescription || ''
        } : {})
      }));
    }
  }, [selectedStop]);

  const handleClose = () => {
    dispatch(closeStopDetail());
  };

  const handleSave = () => {
    console.log('Saving stop:', stopData);
    // TODO: Dispatch save action
    handleClose();
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
          {/* Show instruction when in mark mode */}
          {selectedStop?.mode === 'new' && (!stopData.stopLat || !stopData.stopLng) && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700 flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>Click on the map to mark the stop location</span>
            </div>
          )}

          {/* Show success when location is marked */}
          {stopData.stopLat && stopData.stopLng && (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Location marked! Fill in the details below.</span>
            </div>
          )}

          {/* Stop ID and Stop Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop id</label>
              <input 
                type="text"
                value={stopData.stopId}
                onChange={(e) => setStopData({...stopData, stopId: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop name</label>
              <input 
                type="text"
                value={stopData.stopName}
                onChange={(e) => setStopData({...stopData, stopName: e.target.value})}
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
                type="text"
                value={stopData.stopLat}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Click map to set"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">stop lng</label>
              <input 
                type="text"
                value={stopData.stopLng}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Click map to set"
                readOnly
              />
            </div>
          </div>

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
                {/* Add your optional fields here */}
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
            disabled={!stopData.stopLat || !stopData.stopLng}
          >
            save
          </button>
        </div>
      </div>
    </aside>
  );
}