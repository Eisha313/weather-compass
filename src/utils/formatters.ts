export const formatTemperature = (
  temp: number | null | undefined,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): string => {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return '--°';
  }

  const roundedTemp = Math.round(temp);
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${roundedTemp}${symbol}`;
};

export const convertTemperature = (
  temp: number | null | undefined,
  fromUnit: 'celsius' | 'fahrenheit',
  toUnit: 'celsius' | 'fahrenheit'
): number | null => {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return null;
  }

  if (fromUnit === toUnit) {
    return temp;
  }

  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return (temp * 9) / 5 + 32;
  }

  return ((temp - 32) * 5) / 9;
};

export const formatTime = (date: Date | string | null | undefined): string => {
  if (!date) {
    return '--:--';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '--:--';
    }

    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '--:--';
  }
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return '--';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '--';
    }

    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '--';
  }
};

export const formatDayName = (date: Date | string | null | undefined): string => {
  if (!date) {
    return '--';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '--';
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    }

    if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  } catch {
    return '--';
  }
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--%';
  }
  return `${Math.round(Math.max(0, Math.min(100, value)))}%`;
};

export const formatWindSpeed = (
  speed: number | null | undefined,
  unit: 'mph' | 'kmh' = 'mph'
): string => {
  if (speed === null || speed === undefined || isNaN(speed)) {
    return '-- ' + unit;
  }
  return `${Math.round(speed)} ${unit}`;
};

export const formatHumidity = (humidity: number | null | undefined): string => {
  return formatPercentage(humidity);
};
