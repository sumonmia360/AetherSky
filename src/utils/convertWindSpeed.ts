export default function convertWindSpeed(
  speedInMetersPerSecond: number
): string {
  const speedInKiometersPerSecond = speedInMetersPerSecond * 3.6;
  return `${speedInKiometersPerSecond.toFixed(0)}km/h`;
}
