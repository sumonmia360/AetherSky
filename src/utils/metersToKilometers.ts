export default function metersToKilometers(visabilityInMeters: number): string {
  const visabilityInKilometers = visabilityInMeters / 1000;
  return `${visabilityInKilometers.toFixed(0)} km`;
}
