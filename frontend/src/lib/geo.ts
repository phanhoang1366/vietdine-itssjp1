export interface Coordinates {
  latitude?: number | null;
  longitude?: number | null;
}

function hasCoordinates(value: Coordinates | null | undefined): value is { latitude: number; longitude: number } {
  return typeof value?.latitude === 'number' && typeof value?.longitude === 'number';
}

export function calculateDistanceKm(
  from: Coordinates | null | undefined,
  to: Coordinates | null | undefined
) {
  if (!hasCoordinates(from) || !hasCoordinates(to)) return null;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(distanceKm: number | null) {
  if (distanceKm === null) return '-';
  if (distanceKm < 1) return `${Math.max(1, Math.round(distanceKm * 1000))} m`;
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}
