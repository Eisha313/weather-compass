import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';

interface TemperatureProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUnit?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
  xl: 'text-5xl font-bold',
};

export const Temperature: React.FC<TemperatureProps> = ({
  value,
  size = 'md',
  showUnit = true,
  className = '',
}) => {
  const { temperatureUnit, toggleTemperatureUnit } = useWeatherContext();

  const convertedValue = React.useMemo(() => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((value * 9) / 5 + 32);
    }
    return Math.round(value);
  }, [value, temperatureUnit]);

  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <span
      className={`${sizeClasses[size]} ${className} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={toggleTemperatureUnit}
      title="Click to toggle unit"
    >
      {convertedValue}
      {showUnit && <span className="text-[0.6em] ml-0.5">{unitSymbol}</span>}
    </span>
  );
};

export default Temperature;
