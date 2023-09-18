import React from 'react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 'md',
  animated = true,
}) => {
  const getIconContent = () => {
    const animationClass = animated ? 'animate-pulse' : '';
    
    switch (condition) {
      case 'sunny':
        return (
          <svg
            className={`${sizeClasses[size]} text-yellow-400 ${animated ? 'animate-spin-slow' : ''}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="5" />
            <g className={animated ? 'animate-pulse' : ''}>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
            </g>
          </svg>
        );
      case 'cloudy':
        return (
          <svg
            className={`${sizeClasses[size]} text-gray-400 ${animationClass}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        );
      case 'rainy':
        return (
          <div className="relative">
            <svg
              className={`${sizeClasses[size]} text-gray-500`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${animated ? 'animate-bounce' : ''}`}>
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-blue-400 rounded-full" />
                <div className="w-1 h-3 bg-blue-400 rounded-full" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-3 bg-blue-400 rounded-full" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        );
      case 'snowy':
        return (
          <div className="relative">
            <svg
              className={`${sizeClasses[size]} text-gray-300`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${animated ? 'animate-fall' : ''}`}>
              <div className="flex space-x-2 text-white text-xs">
                <span>❄</span>
                <span>❄</span>
                <span>❄</span>
              </div>
            </div>
          </div>
        );
      case 'stormy':
        return (
          <div className="relative">
            <svg
              className={`${sizeClasses[size]} text-gray-700`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 text-yellow-400 ${animated ? 'animate-flash' : ''}`}>
              ⚡
            </div>
          </div>
        );
      default:
        return (
          <svg
            className={`${sizeClasses[size]} text-blue-300 ${animationClass}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        );
    }
  };

  return <div className="inline-flex items-center justify-center">{getIconContent()}</div>;
};