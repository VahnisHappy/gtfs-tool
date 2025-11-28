import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeStopDetail } from '../../store/slices/appSlice';
import TextInput from '../atoms/TextInput';

export default function StopContentDetail() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
  const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
  
  const [stopData, setStopData] = useState({
    name: '',
    lat: '',
    lng: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    if (selectedStop) {
      if (selectedStop.mode === 'new') {
        setStopData({
          name: '',
          lat: '',
          lng: '',
          code: '',
          description: ''
        });
      } else {
        setStopData({
          name: selectedStop.name || '',
          lat: selectedStop.lat?.toString() || '',
          lng: selectedStop.lng?.toString() || '',
          code: selectedStop.code || '',
          description: selectedStop.description || ''
        });
      }
    }
  }, [selectedStop]);

  const handleClose = () => {
    dispatch(closeStopDetail());
  };

  const handleSave = () => {
    console.log('Saving stop:', stopData);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 h-screen w-[292px] bg-white shadow-xl z-50 border-r overflow-hidden">
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold">Stop Name</h3>
                <button 
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <div className='p-4'>
                <TextInput
                label="Stop Name"
                value={stopData.name}
                placeholder="Enter stop name"
            />
            </div>
            
            
        </div>
    </aside>
  );
}