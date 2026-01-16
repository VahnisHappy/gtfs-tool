// API base URL - adjust based on your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Generic API error handler
export class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
      console.error('API Error Details:', errorData);
    } catch (e) {
      errorMessage = await response.text();
    }
    throw new ApiError(response.status, errorMessage);
  }
  
  // Handle empty responses (e.g., 204 No Content)
  const contentLength = response.headers.get('content-length');
  if (response.status === 204 || contentLength === '0') {
    return undefined as T;
  }
  
  return response.json();
}

// Stop API functions
export const stopsApi = {
  /**
   * Get all stops as GeoJSON
   */
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/stops`);
    return handleResponse(response);
  },

  /**
   * Get stop by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/stops/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new stop
   */
  async create(stopData: CreateStopPayload) {
    const response = await fetch(`${API_BASE_URL}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stopData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing stop
   */
  async update(id: string, stopData: UpdateStopPayload) {
    const response = await fetch(`${API_BASE_URL}/stops/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stopData),
    });
    return handleResponse(response);
  },

  /**
   * Delete a stop
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/stops/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Search stops by name
   */
  async searchByName(query: string) {
    const response = await fetch(`${API_BASE_URL}/stops/search/name?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  /**
   * Find nearby stops
   */
  async findNearby(lat: number, lon: number, radius: number = 1000) {
    const response = await fetch(
      `${API_BASE_URL}/stops/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
    );
    return handleResponse(response);
  },
};

export const routesApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/routes`);
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`);
    return handleResponse(response);
  },

  async create(routeData: CreateRoutePayload) {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });
    return handleResponse(response);
  },

  async update(id: string, routeData: UpdateRoutePayload) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });
    return handleResponse(response);
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
}

// Type definitions for API payloads
export interface CreateStopPayload {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_code?: string;
  stop_desc?: string;
  zone_id?: string;
  stop_url?: string;
  location_type?: number;
  parent_station?: string;
  stop_timezone?: string;
  wheelchair_boarding?: number;
  level_id?: string;
  platform_code?: string;
}

export interface CreateRoutePayload {
  route_id: string;
  route_short_name: string;
  route_type: number;
  route_long_name?: string;
  route_desc?: string;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: number;
  continuous_pickup?: string;
  continuous_drop_off?: string;
  network_id?: string;
  cemv_support?: string;
  route_path?: { lat: number; lng: number }[];
}

export interface UpdateStopPayload extends Partial<CreateStopPayload> {}
export interface UpdateRoutePayload extends Partial<CreateRoutePayload> {}
