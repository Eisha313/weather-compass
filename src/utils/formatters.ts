export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph' | 'ms' = 'kmh'): string {
  switch (unit) {
    case 'mph':
      return `${Math.round(speed * 0.621371)} mph`;
    case 'ms':
      return `${(speed / 3.6).toFixed(1)} m/s`;
    default:
      return `${Math.round(speed)} km/h`;
  }
}

export function formatTime(isoString: string, format: '12h' | '24h' = '24h'): string {
  const date = new Date(isoString);
  
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(dateString: string, format: 'short' | 'long' | 'weekday' = 'short'): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    case 'weekday':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    default:
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(Math.min(100, Math.max(0, value)))}%`;
}

export function formatVisibility(km: number): string {
  if (km >= 10) {
    return 'Excellent';
  } else if (km >= 5) {
    return `${km} km (Good)`;
  } else if (km >= 2) {
    return `${km} km (Moderate)`;
  } else {
    return `${km} km (Poor)`;
  }
}

export function formatPressure(hPa: number): string {
  return `${hPa} hPa`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
