import { useDispatch } from 'react-redux';
import { openStopDetail } from '../store/slices/appSlice'



export function useMapInteractions() {
  const dispatch = useDispatch();

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', { lat, lng });
    
    dispatch(openStopDetail({
      mode: 'new',
      lat: lat,
      lng: lng
    }));
  };

  const handleStationClick = (stationId: string, lat: number, lng: number) => {
    console.log('Station clicked:', { stationId, lat, lng });
    
    dispatch(openStopDetail({
      mode: 'drag',
      id: stationId,
      lat: lat,
      lng: lng
    }));
  };

  return {
    handleMapClick,
    handleStationClick
  };
}