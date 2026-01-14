import type { Stop } from '../types';
import type { CreateStopPayload, UpdateStopPayload } from './api';

/**
 * Convert frontend Stop type to backend CreateStopPayload
 */
export function stopToCreatePayload(stop: Stop): CreateStopPayload {
  const payload: CreateStopPayload = {
    stop_id: stop.id.value,
    stop_name: stop.name.value,
    stop_lat: stop.lat,
    stop_lon: stop.lng,
  };

  // Add optional fields if they exist
  if (stop.code?.value) {
    payload.stop_code = stop.code.value;
  }
  if (stop.description?.value) {
    payload.stop_desc = stop.description.value;
  }
  if (stop.zoneId?.value) {
    payload.zone_id = stop.zoneId.value;
  }
  if (stop.url?.value) {
    payload.stop_url = stop.url.value;
  }
  if (stop.locationType?.value) {
    payload.location_type = parseInt(stop.locationType.value);
  }
  if (stop.parentStation?.value) {
    payload.parent_station = stop.parentStation.value;
  }
  if (stop.timezone?.value) {
    payload.stop_timezone = stop.timezone.value;
  }
  if (stop.wheelchairBoarding?.value) {
    payload.wheelchair_boarding = parseInt(stop.wheelchairBoarding.value);
  }
  if (stop.levelId?.value) {
    payload.level_id = stop.levelId.value;
  }
  if (stop.platformCode?.value) {
    payload.platform_code = stop.platformCode.value;
  }

  return payload;
}

/**
 * Convert frontend Stop type to backend UpdateStopPayload
 */
export function stopToUpdatePayload(stop: Stop): UpdateStopPayload {
  // For updates, we use the same structure as create
  return stopToCreatePayload(stop);
}


