import type { Point } from '../types';
import type { ExternalPOI } from './mapboxPOI';

const EARTH_RADIUS = 6371e3; // meters

/**
 * Haversine distance between two points in meters
 */
function haversine(p1: Point, p2: Point): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
    return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Compute cumulative distances along a path of points
 */
function cumulativeDistances(path: Point[]): number[] {
    const dists = [0];
    for (let i = 1; i < path.length; i++) {
        dists.push(dists[i - 1] + haversine(path[i - 1], path[i]));
    }
    return dists;
}

/**
 * Interpolate along a path at a given total distance from start
 */
function interpolateAlongPath(path: Point[], cumDists: number[], targetDist: number): Point {
    if (targetDist <= 0) return path[0];
    if (targetDist >= cumDists[cumDists.length - 1]) return path[path.length - 1];

    // Find the segment containing the target distance
    for (let i = 1; i < cumDists.length; i++) {
        if (cumDists[i] >= targetDist) {
            const segmentStart = cumDists[i - 1];
            const segmentEnd = cumDists[i];
            const t = (targetDist - segmentStart) / (segmentEnd - segmentStart);
            return {
                lat: path[i - 1].lat + (path[i].lat - path[i - 1].lat) * t,
                lng: path[i - 1].lng + (path[i].lng - path[i - 1].lng) * t,
            };
        }
    }
    return path[path.length - 1];
}

export interface PlannedStation {
    position: Point;
    index: number; // 1-based station number
    nearbyPOIs: { name: string; category: string; distance: number }[];
}

const SIC_ALPHA = 1;  // attractiveness exponent (calibrated in paper)
const SIC_BETA = 2;   // distance decay exponent (calibrated in paper)

/**
 * Compute SIC score for a given set of selected station positions.
 * Higher = better coverage of demand (POIs).
 *
 * Sij = [ wj^α * dij^-β / Σk∈Ni(wk^α * dik^-β) ] * αi * Xj
 * Z   = Σi Σj Sij
 */
function computeSIC(
    candidates: Point[],
    selectedIndices: Set<number>,
    pois: ExternalPOI[],
    pullRadius: number,
): number {
    let totalZ = 0;

    for (const poi of pois) {
        const poiPoint: Point = { lat: poi.coordinates[1], lng: poi.coordinates[0] };
        const demand = poi.weight; // αi

        // Find all candidate stations within willingness-to-walk distance (Ni)
        const reachable: Array<{ idx: number; dist: number }> = [];
        for (const idx of selectedIndices) {
            const dist = haversine(poiPoint, candidates[idx]);
            if (dist <= pullRadius && dist > 0) {
                reachable.push({ idx, dist });
            }
        }

        if (reachable.length === 0) continue;

        // Denominator: Σk∈Ni wk^α * dik^-β
        // Here wk (stop attractiveness) = sum of POI weights near that candidate
        const denominator = reachable.reduce((sum, { idx, dist }) => {
            const wk = getStationAttractiveness(candidates[idx], pois, pullRadius);
            return sum + Math.pow(wk, SIC_ALPHA) * Math.pow(dist, -SIC_BETA);
        }, 0);

        if (denominator === 0) continue;

        // Sij for each selected station within reach
        for (const { idx, dist } of reachable) {
            const wj = getStationAttractiveness(candidates[idx], pois, pullRadius);
            const numerator = Math.pow(wj, SIC_ALPHA) * Math.pow(dist, -SIC_BETA);
            const sij = (numerator / denominator) * demand;
            totalZ += sij;
        }
    }

    return totalZ;
}

/**
 * Station attractiveness = weighted sum of POIs within pullRadius.
 * Equivalent to wj in the paper (connectivity + surroundings).
 */
function getStationAttractiveness(
    station: Point,
    pois: ExternalPOI[],
    pullRadius: number,
): number {
    let attractiveness = 0;
    for (const poi of pois) {
        const poiPoint: Point = { lat: poi.coordinates[1], lng: poi.coordinates[0] };
        const dist = haversine(station, poiPoint);
        if (dist <= pullRadius) {
            attractiveness += poi.weight * (1 - dist / pullRadius);
        }
    }
    return Math.max(attractiveness, 0.01); // avoid zero
}

/**
 * Simulated Annealing to find the optimal subset of p stations
 * from a dense set of candidates, maximizing SIC score.
 */
function simulatedAnnealingSIC(
    candidates: Point[],
    stationCount: number,
    pois: ExternalPOI[],
    pullRadius: number,
    initialTemp = 1000,
    coolingRate = 0.95,
    minTemp = 1,
): Set<number> {
    // Random initial selection
    const allIndices = candidates.map((_, i) => i);
    let current = new Set<number>(
        allIndices.sort(() => Math.random() - 0.5).slice(0, stationCount)
    );
    let currentScore = computeSIC(candidates, current, pois, pullRadius);
    let best = new Set(current);
    let bestScore = currentScore;

    let temp = initialTemp;

    while (temp > minTemp) {
        // Swap one selected station for one unselected candidate
        const selectedArr = [...current];
        const unselectedArr = allIndices.filter(i => !current.has(i));

        const removeIdx = selectedArr[Math.floor(Math.random() * selectedArr.length)];
        const addIdx = unselectedArr[Math.floor(Math.random() * unselectedArr.length)];

        const neighbor = new Set(current);
        neighbor.delete(removeIdx);
        neighbor.add(addIdx);

        const neighborScore = computeSIC(candidates, neighbor, pois, pullRadius);
        const delta = neighborScore - currentScore;

        // Accept if better, or probabilistically if worse
        if (delta > 0 || Math.random() < Math.exp(delta / temp)) {
            current = neighbor;
            currentScore = neighborScore;
        }

        if (currentScore > bestScore) {
            best = new Set(current);
            bestScore = currentScore;
        }

        temp *= coolingRate;
    }

    return best;
}

/**
 * Updated planStations using SIC + Simulated Annealing.
 */
export function planStations(
    pointA: Point,
    pointB: Point,
    stationCount: number,
    pois: ExternalPOI[],
    routePath?: Point[],
    pullRadius: number = 500,
    pullStrength: number = 0.3, // kept for backwards compat, unused
): PlannedStation[] {
    if (stationCount < 1) return [];

    const path = routePath && routePath.length >= 2 ? routePath : [pointA, pointB];
    const cumDists = cumulativeDistances(path);
    const totalDistance = cumDists[cumDists.length - 1];

    // Generate dense candidate grid along the route (e.g. every 100m)
    const candidateCount = Math.max(stationCount * 5, Math.ceil(totalDistance / 100));
    const candidates: Point[] = [];
    for (let i = 1; i <= candidateCount; i++) {
        const d = (totalDistance * i) / (candidateCount + 1);
        candidates.push(interpolateAlongPath(path, cumDists, d));
    }

    // Find optimal station subset via SA + SIC
    const bestIndices = simulatedAnnealingSIC(
        candidates,
        stationCount,
        pois,
        pullRadius,
    );

    // Sort by position along route
    const sortedIndices = [...bestIndices].sort((a, b) => a - b);

    return sortedIndices.map((candidateIdx, i) => {
        const position = candidates[candidateIdx];

        const nearby: PlannedStation['nearbyPOIs'] = pois
            .map(poi => {
                const poiPoint: Point = { lat: poi.coordinates[1], lng: poi.coordinates[0] };
                return {
                    name: poi.name,
                    category: poi.categoryLabel,
                    distance: Math.round(haversine(position, poiPoint)),
                };
            })
            .filter(p => p.distance <= pullRadius)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        return {
            position,
            index: i + 1,
            nearbyPOIs: nearby,
        };
    });
}

/**
 * Find the optimal number of stations using SIC marginal gain analysis.
 * Tries p = 1..maxP, running SA for each, and stops when adding another
 * station improves SIC by less than `gainThreshold` (elbow method).
 */
export function findOptimalStationCount(
    pointA: Point,
    pointB: Point,
    pois: ExternalPOI[],
    routePath?: Point[],
    pullRadius: number = 500,
    maxStations: number = 15,
    gainThreshold: number = 0.10,
): number {
    if (pois.length === 0) return 1;

    const path = routePath && routePath.length >= 2 ? routePath : [pointA, pointB];
    const cumDists = cumulativeDistances(path);
    const totalDistance = cumDists[cumDists.length - 1];

    const maxCandidates = Math.max(maxStations * 5, Math.ceil(totalDistance / 100));
    const candidateCount = Math.min(maxCandidates, 200);
    const candidates: Point[] = [];
    for (let i = 1; i <= candidateCount; i++) {
        const d = (totalDistance * i) / (candidateCount + 1);
        candidates.push(interpolateAlongPath(path, cumDists, d));
    }

    let prevScore = 0;
    let optimalP = 1;

    for (let p = 1; p <= Math.min(maxStations, candidateCount); p++) {
        const bestIndices = simulatedAnnealingSIC(
            candidates, p, pois, pullRadius,
            500, 0.93, 1,
        );
        const score = computeSIC(candidates, bestIndices, pois, pullRadius);

        if (p === 1) {
            prevScore = score;
            optimalP = 1;
            continue;
        }

        const marginalGain = prevScore > 0 ? (score - prevScore) / prevScore : 1;

        if (marginalGain < gainThreshold) {
            break;
        }

        optimalP = p;
        prevScore = score;
    }

    return optimalP;
}
