import React from 'react';
import { WeatherCondition as WeatherConditionType } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface WeatherConditionProps {
  condition: WeatherConditionType;
  showDescription?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const iconSizes = {
  sm: 24,
  md: 48,
  lg: 96,
};

const conditionColors: Record<string, string> = {
  clear: 'text-yellow-500',
  clouds: 'text-gray-500',
  rain: 'text-blue-500',
  drizzle: 'text-blue-400',
  thunderstorm: 'text-purple-600',
  snow: 'text-cyan-300',
  mist: 'text-gray-400',
  fog: 'text-gray-400',
  haze: 'text-orange-300',
};

export const WeatherCondition: React.FC<WeatherConditionProps> = ({
  condition,
  showDescription = true,
  iconSize = 'md',
  layout = 'vertical',
  className = '',
}) => {
  const colorClass = conditionColors[condition.main.toLowerCase()] || 'text-gray-600';
  
  const containerClasses = layout === 'horizontal'
    ? 'flex items-center gap-2'
    : 'flex flex-col items-center gap-1';

  return (
    <div className={`${containerClasses} ${className}`}>
      <WeatherIcon
        condition={condition.main}
        iconCode={condition.icon}
        size={iconSizes[iconSize]}
        animated
      />
      {showDescription && (
        <div className="text-center">
          <p className={`font-medium capitalize ${colorClass}`}>
            {condition.main}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {condition.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherCondition;
