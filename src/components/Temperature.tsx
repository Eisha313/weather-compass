import React from 'react';
import { formatTemperature, convertTemperature } from '../utils/formatters';

interface TemperatureProps {
  value: number | null | undefined;
  unit?: 'celsius' | 'fahrenheit';
  displayUnit?: 'celsius' | 'fahrenheit';
  size?: 'small' | 'medium' | 'large';
  showUnit?: boolean;
  className?: string;
}

const sizeClasses = {
  small: 'text-sm',
  medium: 'text-xl',
  large: 'text-5xl font-bold',
};

export const Temperature: React.FC<TemperatureProps> = ({
  value,
  unit = 'celsius',
  displayUnit,
  size = 'medium',
  showUnit = true,
  className = '',
}) => {
  const targetUnit = displayUnit || unit;
  
  // Convert temperature if needed
  const displayValue = unit !== targetUnit
    ? convertTemperature(value, unit, targetUnit)
    : value;

  const formattedTemp = showUnit
    ? formatTemperature(displayValue, targetUnit)
    : displayValue !== null && displayValue !== undefined && !isNaN(displayValue)
      ? `${Math.round(displayValue)}°`
      : '--°';

  const isValidTemp = value !== null && value !== undefined && !isNaN(value);

  return (
    <span 
      className={`${sizeClasses[size]} ${className} ${!isValidTemp ? 'text-gray-400' : ''}`}
      aria-label={isValidTemp ? `Temperature: ${formattedTemp}` : 'Temperature unavailable'}
    >
      {formattedTemp}
    </span>
  );
};

export default Temperature;
