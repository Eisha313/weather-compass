import { HourlyForecast, DailyForecast, WeatherCondition } from '../types/weather';

export interface ForecastPeriod {
  startTime: Date;
  endTime: Date;
  label: string;
}

export function groupHourlyByDay(hourlyData: HourlyForecast[]): Map<string, HourlyForecast[]> {
  const grouped = new Map<string, HourlyForecast[]>();
  
  hourlyData.forEach(hour => {
    const dateKey = hour.time.toISOString().split('T')[0];
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, hour]);
  });
  
  return grouped;
}

export function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getDominantCondition(conditions: WeatherCondition[]): WeatherCondition {
  const priority: Record<WeatherCondition, number> = {
    thunderstorm: 10,
    snow: 9,
    rain: 8,
    drizzle: 7,
    fog: 6,
    cloudy: 5,
    'partly-cloudy': 4,
    clear: 3,
    windy: 2,
  };
  
  return conditions.reduce((dominant, current) => 
    (priority[current] || 0) > (priority[dominant] || 0) ? current : dominant
  , conditions[0]);
}

export function calculateAverageTemperature(forecasts: HourlyForecast[]): number {
  if (forecasts.length === 0) return 0;
  const sum = forecasts.reduce((acc, f) => acc + f.temperature, 0);
  return Math.round(sum / forecasts.length);
}

export function getMaxPrecipitation(forecasts: HourlyForecast[]): number {
  if (forecasts.length === 0) return 0;
  return Math.max(...forecasts.map(f => f.precipitationProbability));
}

export function findTemperatureExtremes(
  forecasts: HourlyForecast[]
): { high: number; low: number; highTime: Date; lowTime: Date } {
  if (forecasts.length === 0) {
    const now = new Date();
    return { high: 0, low: 0, highTime: now, lowTime: now };
  }
  
  let high = forecasts[0];
  let low = forecasts[0];
  
  forecasts.forEach(f => {
    if (f.temperature > high.temperature) high = f;
    if (f.temperature < low.temperature) low = f;
  });
  
  return {
    high: high.temperature,
    low: low.temperature,
    highTime: high.time,
    lowTime: low.time,
  };
}

export function interpolateHourlyData(
  hourlyData: HourlyForecast[],
  targetHours: number[]
): HourlyForecast[] {
  return targetHours.map(targetHour => {
    const exactMatch = hourlyData.find(h => h.time.getHours() === targetHour);
    if (exactMatch) return exactMatch;
    
    // Find closest hours for interpolation
    const sorted = [...hourlyData].sort((a, b) => 
      Math.abs(a.time.getHours() - targetHour) - Math.abs(b.time.getHours() - targetHour)
    );
    
    return sorted[0] || hourlyData[0];
  });
}

export function getForecastSummary(dailyForecast: DailyForecast): string {
  const { condition, high, low, precipitationProbability } = dailyForecast;
  
  const conditionText = condition.replace('-', ' ');
  const tempRange = `High of ${high}°, low of ${low}°`;
  
  if (precipitationProbability > 70) {
    return `${conditionText} with high chance of precipitation. ${tempRange}.`;
  } else if (precipitationProbability > 30) {
    return `${conditionText} with possible precipitation. ${tempRange}.`;
  }
  
  return `${conditionText}. ${tempRange}.`;
}
