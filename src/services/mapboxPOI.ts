import type { Point } from '../types';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '';

// Important POI categories for transit station planning
export const POI_CATEGORIES = [
    { id: 'hospital', label: '🏥 Hospital', color: '#E91E63', weight: 3 },
    { id: 'education', label: '🏫 Education', color: '#FF9800', weight: 3 },
    { id: 'shopping_mall', label: '🛍️ Shopping Mall', color: '#3498DB', weight: 2 },
    { id: 'park', label: '🌳 Park', color: '#27AE60', weight: 1 },
    { id: 'government_office', label: '🏛️ Government', color: '#607D8B', weight: 2 },
    { id: 'bus_station', label: '🚌 Bus Station', color: '#00A8E8', weight: 3 },
    { id: 'train_station', label: '🚉 Train Station', color: '#9C27B0', weight: 3 },
] as const;

export type POICategory = typeof POI_CATEGORIES[number]['id'];

export interface ExternalPOI {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    weight: number;
    address?: string;
    coordinates: [number, number]; // [lon, lat]
}

/**
 * Compute the bounding box from polygon vertices
 */
function computeBBox(vertices: Point[]): [number, number, number, number] {
    let minLon = Infinity, minLat = Infinity;
    let maxLon = -Infinity, maxLat = -Infinity;

    for (const v of vertices) {
        if (v.lng < minLon) minLon = v.lng;
        if (v.lng > maxLon) maxLon = v.lng;
        if (v.lat < minLat) minLat = v.lat;
        if (v.lat > maxLat) maxLat = v.lat;
    }

    return [minLon, minLat, maxLon, maxLat];
}

/**
 * Ray-casting point-in-polygon test
 */
function isPointInPolygon(lat: number, lon: number, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lng, yi = polygon[i].lat;
        const xj = polygon[j].lng, yj = polygon[j].lat;

        const intersect =
            yi > lat !== yj > lat &&
            lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Search for POIs in a specific category within a bbox
 */
async function searchCategory(
    category: string,
    bbox: [number, number, number, number],
    limit: number = 25,
): Promise<any[]> {
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const url = `https://api.mapbox.com/search/searchbox/v1/category/${category}?bbox=${minLon},${minLat},${maxLon},${maxLat}&limit=${limit}&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    if (!response.ok) {
        console.warn(`Mapbox category search failed for "${category}":`, response.status);
        return [];
    }

    const data = await response.json();
    return data.features || [];
}

/**
 * Search for important external POIs within a polygon
 */
export async function searchExternalPOIs(
    polygonVertices: Point[],
    categories: POICategory[] = POI_CATEGORIES.map(c => c.id),
): Promise<ExternalPOI[]> {
    if (polygonVertices.length < 3) return [];

    const bbox = computeBBox(polygonVertices);

    const results = await Promise.allSettled(
        categories.map(cat => searchCategory(cat, bbox)),
    );

    const allPOIs: ExternalPOI[] = [];

    results.forEach((result, idx) => {
        if (result.status !== 'fulfilled') return;

        const categoryId = categories[idx];
        const categoryMeta = POI_CATEGORIES.find(c => c.id === categoryId);

        for (const feature of result.value) {
            const coords = feature.geometry?.coordinates;
            if (!coords || coords.length < 2) continue;

            const [lon, lat] = coords;

            // Only keep POIs actually inside the polygon
            if (!isPointInPolygon(lat, lon, polygonVertices)) continue;

            allPOIs.push({
                id: feature.properties?.mapbox_id || feature.id || `${categoryId}-${lon}-${lat}`,
                name: feature.properties?.name || 'Unknown',
                category: categoryId,
                categoryLabel: categoryMeta?.label || categoryId,
                weight: categoryMeta?.weight || 1,
                address: feature.properties?.full_address || feature.properties?.address || undefined,
                coordinates: [lon, lat],
            });
        }
    });

    return allPOIs;
}
