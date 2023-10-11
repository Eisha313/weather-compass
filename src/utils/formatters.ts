/**
 * Formatting utilities for weather data display
 */

import { formatLocalTime, convertToLocalTime } from './timezone';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * Convert temperature between units
 * API returns Kelvin by default, but we request metric (Celsius)
 */
export function convertTemperature(celsius: number, to: TemperatureUnit): number {
  if (to === 'fahrenheit') {
    // Fixed: Use correct formula C * 9/5 + 32
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

/**
 * Format temperature for display with unit symbol
 */
export function formatTemperature(
  value: number,
  unit: TemperatureUnit = 'celsius',
  showUnit = true
): string {
  const converted = convertTemperature(value, unit);
  const rounded = Math.round(converted);
  
  if (!showUnit) {
    return `${rounded}`;
  }
  
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${rounded}${symbol}`;
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(metersPerSecond: number, useImperial = false): string {
  if (useImperial) {
    const mph = metersPerSecond * 2.237;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(metersPerSecond)} m/s`;
}

/**
 * Format visibility distance
 */
export function formatVisibility(meters: number, useImperial = false): string {
  if (useImperial) {
    const miles = meters / 1609.34;
    return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.281)} ft`;
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

/**
 * Format pressure with unit
 */
export function formatPressure(hPa: number): string {
  return `${hPa} hPa`;
}

/**
 * Format UV index with description
 */
export function formatUVIndex(uvi: number): { value: string; level: string } {
  let level: string;
  
  if (uvi <= 2) {
    level = 'Low';
  } else if (uvi <= 5) {
    level = 'Moderate';
  } else if (uvi <= 7) {
    level = 'High';
  } else if (uvi <= 10) {
    level = 'Very High';
  } else {
    level = 'Extreme';
  }
  
  return {
    value: uvi.toFixed(1),
    level
  };
}

/**
 * Format time for display - timezone aware
 */
export function formatTime(
  timestamp: number,
  timezoneOffset: number = 0,
  use24Hour = false
): string {
  return formatLocalTime(timestamp, timezoneOffset, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour
  });
}

/**
 * Format date for display - timezone aware
 */
export function formatDate(
  timestamp: number,
  timezoneOffset: number = 0,
  options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
): string {
  const localDate = convertToLocalTime(timestamp, timezoneOffset);
  return localDate.toLocaleDateString('en-US', {
    ...options,
    timeZone: 'UTC'
  });
}

/**
 * Get relative time description (e.g., "2 hours ago", "in 3 hours")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp * 1000 - now;
  const absDiff = Math.abs(diff);
  
  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);
  
  const isFuture = diff > 0;
  const prefix = isFuture ? 'in ' : '';
  const suffix = isFuture ? '' : ' ago';
  
  if (minutes < 1) {
    return 'just now';
  } else if (minutes < 60) {
    return `${prefix}${minutes} min${suffix}`;
  } else if (hours < 24) {
    return `${prefix}${hours} hr${hours > 1 ? 's' : ''}${suffix}`;
  } else {
    return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
  }
}
