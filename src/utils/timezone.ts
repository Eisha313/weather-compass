/**
 * Timezone utilities for handling location-based time conversions
 */

export interface TimezoneInfo {
  offset: number; // offset in seconds from UTC
  name?: string;
}

/**
 * Convert UTC timestamp to local time for a specific timezone
 */
export function convertToLocalTime(utcTimestamp: number, timezoneOffset: number): Date {
  // utcTimestamp is in seconds, timezoneOffset is in seconds
  const utcDate = new Date(utcTimestamp * 1000);
  const localTimestamp = utcTimestamp + timezoneOffset;
  return new Date(localTimestamp * 1000);
}

/**
 * Get the current time in a specific timezone
 */
export function getCurrentTimeInTimezone(timezoneOffset: number): Date {
  const now = new Date();
  const utcTimestamp = Math.floor(now.getTime() / 1000);
  // Adjust for local browser timezone and target timezone
  const browserOffset = now.getTimezoneOffset() * 60; // convert minutes to seconds
  const adjustedTimestamp = utcTimestamp + browserOffset + timezoneOffset;
  return new Date(adjustedTimestamp * 1000);
}

/**
 * Format time for display in location's timezone
 */
export function formatLocalTime(
  utcTimestamp: number,
  timezoneOffset: number,
  options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
): string {
  const localDate = convertToLocalTime(utcTimestamp, timezoneOffset);
  // Use UTC formatting since we've already adjusted the timestamp
  return localDate.toLocaleTimeString('en-US', {
    ...options,
    timeZone: 'UTC'
  });
}

/**
 * Check if a timestamp falls within "today" for a specific timezone
 */
export function isToday(utcTimestamp: number, timezoneOffset: number): boolean {
  const localDate = convertToLocalTime(utcTimestamp, timezoneOffset);
  const now = getCurrentTimeInTimezone(timezoneOffset);
  
  return (
    localDate.getUTCFullYear() === now.getUTCFullYear() &&
    localDate.getUTCMonth() === now.getUTCMonth() &&
    localDate.getUTCDate() === now.getUTCDate()
  );
}

/**
 * Get the day name for a timestamp in a specific timezone
 */
export function getDayName(utcTimestamp: number, timezoneOffset: number, short = false): string {
  const localDate = convertToLocalTime(utcTimestamp, timezoneOffset);
  return localDate.toLocaleDateString('en-US', {
    weekday: short ? 'short' : 'long',
    timeZone: 'UTC'
  });
}

/**
 * Group hourly forecasts by day in the location's timezone
 */
export function groupForecastsByDay<T extends { dt: number }>(
  forecasts: T[],
  timezoneOffset: number
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  forecasts.forEach(forecast => {
    const localDate = convertToLocalTime(forecast.dt, timezoneOffset);
    const dateKey = localDate.toISOString().split('T')[0];
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(forecast);
  });
  
  return grouped;
}
