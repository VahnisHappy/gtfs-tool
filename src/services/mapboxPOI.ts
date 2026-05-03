import { poi_categories } from '../data';
import type { Point } from '../types';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '';

export const POI_CATEGORIES = poi_categories;

export type POICategory = typeof POI_CATEGORIES[number]['id'];

type POICategoryMeta = (typeof POI_CATEGORIES)[number];

const MAPBOX_CATEGORY_LOOKUP = new Map<string, POICategoryMeta>();
POI_CATEGORIES.forEach(category => {
    category.mapboxCategories.forEach(mapboxId => {
        MAPBOX_CATEGORY_LOOKUP.set(mapboxId, category);
    });
});

const DEFAULT_POI_CATEGORY_IDS: POICategory[] = POI_CATEGORIES.map(c => c.id);

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
    categories: POICategory[] = DEFAULT_POI_CATEGORY_IDS,
): Promise<ExternalPOI[]> {
    if (polygonVertices.length < 3) return [];

    const bbox = computeBBox(polygonVertices);

    const allowedCategoryIds = new Set(categories);
    const selectedCategories = POI_CATEGORIES.filter(category =>
        allowedCategoryIds.has(category.id),
    );
    if (!selectedCategories.length) return [];

    const mapboxCategories = Array.from(
        new Set(selectedCategories.flatMap(category => category.mapboxCategories)),
    );

    const results = await Promise.allSettled(
        mapboxCategories.map(cat => searchCategory(cat, bbox)),
    );

    const allPOIs: ExternalPOI[] = [];

    results.forEach((result, idx) => {
        if (result.status !== 'fulfilled') return;

        const mapboxCategoryId = mapboxCategories[idx];
        const categoryMeta = MAPBOX_CATEGORY_LOOKUP.get(mapboxCategoryId);

        for (const feature of result.value) {
            const coords = feature.geometry?.coordinates;
            if (!coords || coords.length < 2) continue;

            const [lon, lat] = coords;

            // Only keep POIs actually inside the polygon
            if (!isPointInPolygon(lat, lon, polygonVertices)) continue;

            allPOIs.push({
                id:
                    feature.properties?.mapbox_id ||
                    feature.id ||
                    `${categoryMeta?.id || mapboxCategoryId}-${lon}-${lat}`,
                name: feature.properties?.name || 'Unknown',
                category: categoryMeta?.id || mapboxCategoryId,
                categoryLabel: categoryMeta?.label || mapboxCategoryId,
                weight: categoryMeta?.weight || 1,
                address: feature.properties?.full_address || feature.properties?.address || undefined,
                coordinates: [lon, lat],
            });
        }
    });

    return allPOIs;
}
